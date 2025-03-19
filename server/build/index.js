"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const openai_1 = require("openai");
const movieRoutes_1 = __importDefault(require("./routes/movieRoutes"));
const cinemaRoutes_1 = __importDefault(require("./routes/cinemaRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Initialize OpenAI
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
// Debug middleware for all routes
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('Request body:', req.body);
    }
    next();
});
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/bookit', movieRoutes_1.default);
app.use('/bookit/cinema', cinemaRoutes_1.default);
app.use('/bookit/user', userRoutes_1.default);
// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
//chat bot api endpoint
app.post('/api/chat', async (req, res) => {
    var _a, _b, _c;
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid request format' });
        }
        // Get the last user message
        const lastUserMessage = ((_a = messages.filter(m => m.role === 'user').pop()) === null || _a === void 0 ? void 0 : _a.content.toLowerCase()) || '';
        // Check if it's a movie-related query
        const isMovieQuery = lastUserMessage.includes('movie') ||
            lastUserMessage.includes('film') ||
            lastUserMessage.includes('watch') ||
            lastUserMessage.includes('show') ||
            lastUserMessage.includes('recommend') ||
            lastUserMessage.includes('suggest');
        // If it's a movie query, we'll let the frontend handle it
        // since it already has the movie data and can provide better recommendations
        if (isMovieQuery) {
            try {
                // Try to use OpenAI API for more natural responses
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
                    message: ((_b = response.choices[0]) === null || _b === void 0 ? void 0 : _b.message) || { content: 'Sorry, I could not process your request.' }
                });
            }
            catch (openaiError) {
                console.error('Error calling OpenAI API:', openaiError);
                // Fallback for movie queries
                let responseContent = "I can help you find movies you might enjoy. What genres or languages are you interested in?";
                res.json({
                    message: { role: 'assistant', content: responseContent }
                });
            }
            return;
        }
        // For non-movie queries, proceed with regular processing
        try {
            // Try to use OpenAI API
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
                message: ((_c = response.choices[0]) === null || _c === void 0 ? void 0 : _c.message) || { content: 'Sorry, I could not process your request.' }
            });
        }
        catch (openaiError) {
            console.error('Error calling OpenAI API:', openaiError);
            // Fallback to predefined responses
            let responseContent = 'I apologize, but I am currently experiencing technical difficulties. Please try again later.';
            // Simple pattern matching for common queries
            if (lastUserMessage.includes('hello') || lastUserMessage.includes('hi') || lastUserMessage.includes('hey')) {
                responseContent = 'Hello! How can I help you with your movie booking today?';
            }
            else if (lastUserMessage.includes('book') || lastUserMessage.includes('ticket') || lastUserMessage.includes('seat')) {
                responseContent = 'To book tickets, simply select a movie from our homepage, choose your preferred showtime, and select your seats.';
            }
            else if (lastUserMessage.includes('cancel') || lastUserMessage.includes('refund')) {
                responseContent = 'For cancellations or refunds, please contact our customer support team.';
            }
            else if (lastUserMessage.includes('price') || lastUserMessage.includes('cost') || lastUserMessage.includes('fee')) {
                responseContent = 'Ticket prices vary depending on the movie, showtime, and seat selection. You can see the exact price during the booking process.';
            }
            else if (lastUserMessage.includes('time') || lastUserMessage.includes('schedule') || lastUserMessage.includes('when')) {
                responseContent = 'Movie showtimes are displayed on each movie\'s detail page. You can select your preferred date to see available times.';
            }
            else if (lastUserMessage.includes('payment') || lastUserMessage.includes('pay')) {
                responseContent = 'We accept various payment methods including credit/debit cards and UPI. All transactions are secure.';
            }
            else if (lastUserMessage.includes('location') || lastUserMessage.includes('theater') || lastUserMessage.includes('cinema')) {
                responseContent = 'You can select your preferred theater location during the booking process.';
            }
            else if (lastUserMessage.includes('food') || lastUserMessage.includes('snack') || lastUserMessage.includes('popcorn')) {
                responseContent = 'Food and beverages can be pre-ordered during the booking process or purchased at the theater.';
            }
            else if (lastUserMessage.includes('thank')) {
                responseContent = 'You\'re welcome! Is there anything else I can help you with?';
            }
            res.json({
                message: { role: 'assistant', content: responseContent }
            });
        }
    }
    catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});
const PORT = process.env.PORT || 1001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
