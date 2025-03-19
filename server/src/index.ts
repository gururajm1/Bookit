import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import { OpenAI } from 'openai';
import movieRoutes from './routes/movieRoutes';
import cinemaRoutes from './routes/cinemaRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes'

dotenv.config();

const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST') {
    console.log('Request body:', req.body);
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/bookit', movieRoutes);
app.use('/bookit/cinema', cinemaRoutes);
app.use('/bookit/user', userRoutes);
app.use('/bookit/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }
    
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content.toLowerCase() || '';
    
    const isMovieQuery = 
      lastUserMessage.includes('movie') || 
      lastUserMessage.includes('film') || 
      lastUserMessage.includes('watch') ||
      lastUserMessage.includes('show') ||
      lastUserMessage.includes('recommend') ||
      lastUserMessage.includes('suggest');
    
    if (isMovieQuery) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { 
              role: 'system', 
              content: 'You are a helpful assistant for a movie booking website. You can provide information about movies, help with booking issues, and answer general questions. When users ask about specific movies or recommendations, acknowledge their request but don\'t make up any specific movie titles or details as the frontend will handle that part.' 
            },
            ...messages
          ],
          max_tokens: 150,
        });
        
        res.json({
          message: response.choices[0]?.message || { content: 'Sorry, I could not process your request.' }
        });
      } catch (openaiError) {
        console.error('Error calling OpenAI API:', openaiError);
        
        let responseContent = "I can help you find movies you might enjoy. What genres or languages are you interested in?";
        
        res.json({
          message: { role: 'assistant', content: responseContent }
        });
      }
      return;
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful assistant for a movie booking website. You can provide information about movies, help with booking issues, and answer general questions.' 
          },
          ...messages
        ],
        max_tokens: 150,
      });
      
      res.json({
        message: response.choices[0]?.message || { content: 'Sorry, I could not process your request.' }
      });
    } catch (openaiError) {
      console.error('Error calling OpenAI API:', openaiError);
      
      let responseContent = 'I apologize, but I am currently experiencing technical difficulties. Please try again later.';
      
      if (lastUserMessage.includes('hello') || lastUserMessage.includes('hi') || lastUserMessage.includes('hey')) {
        responseContent = 'Hello! How can I help you with your movie booking today?';
      } else if (lastUserMessage.includes('book') || lastUserMessage.includes('ticket') || lastUserMessage.includes('seat')) {
        responseContent = 'To book tickets, simply select a movie from our homepage, choose your preferred showtime, and select your seats.';
      } else if (lastUserMessage.includes('cancel') || lastUserMessage.includes('refund')) {
        responseContent = 'For cancellations or refunds, please contact our customer support team.';
      } else if (lastUserMessage.includes('price') || lastUserMessage.includes('cost') || lastUserMessage.includes('fee')) {
        responseContent = 'Ticket prices vary depending on the movie, showtime, and seat selection. You can see the exact price during the booking process.';
      } else if (lastUserMessage.includes('time') || lastUserMessage.includes('schedule') || lastUserMessage.includes('when')) {
        responseContent = 'Movie showtimes are displayed on each movie\'s detail page. You can select your preferred date to see available times.';
      } else if (lastUserMessage.includes('payment') || lastUserMessage.includes('pay')) {
        responseContent = 'We accept various payment methods including credit/debit cards and UPI. All transactions are secure.';
      } else if (lastUserMessage.includes('location') || lastUserMessage.includes('theater') || lastUserMessage.includes('cinema')) {
        responseContent = 'You can select your preferred theater location during the booking process.';
      } else if (lastUserMessage.includes('food') || lastUserMessage.includes('snack') || lastUserMessage.includes('popcorn')) {
        responseContent = 'Food and beverages can be pre-ordered during the booking process or purchased at the theater.';
      } else if (lastUserMessage.includes('thank')) {
        responseContent = 'You\'re welcome! Is there anything else I can help you with?';
      }
      
      res.json({
        message: { role: 'assistant', content: responseContent }
      });
    }
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});



mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 1004;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
