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
const Movie_1 = require("./models/Movie");
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
// Enhanced OpenAI chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        const lastMessage = messages[messages.length - 1].content.toLowerCase();
        // First try to match with our movie database
        const movieData = await Movie_1.MovieModel.find({});
        let localResponse = '';
        // Enhanced movie matching logic
        if (movieData.length > 0) {
            const movieMatches = movieData.filter((movie) => {
                const searchTerms = lastMessage.split(' ');
                return searchTerms.some((term) => movie.title.toLowerCase().includes(term) ||
                    movie.genres.toLowerCase().includes(term) ||
                    movie.languages.toLowerCase().includes(term) ||
                    movie.certification.toLowerCase().includes(term) ||
                    (movie.cast && movie.cast.some((actor) => actor.toLowerCase().includes(term))) ||
                    (movie.director && movie.director.toLowerCase().includes(term)));
            });
            if (movieMatches.length > 0) {
                localResponse = formatMovieResponse(movieMatches, lastMessage);
            }
        }
        if (localResponse) {
            return res.json({ message: { role: 'assistant', content: localResponse } });
        }
        // If no local match, use OpenAI with enhanced movie-focused prompt
        const openaiMessages = [
            {
                role: 'system',
                content: `You are a knowledgeable movie booking assistant. Focus on providing accurate, relevant information about movies, actors, directors, and cinema. 
                 If asked about non-movie topics, politely redirect the conversation to movies.
                 Keep responses concise and well-structured.
                 Format responses with appropriate emojis and markdown for better readability.
                 Current date: ${new Date().toLocaleDateString()}`
            },
            ...messages.slice(-5), // Keep context manageable
        ];
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: openaiMessages,
            temperature: 0.7,
            max_tokens: 500,
        });
        const aiResponse = completion.choices[0].message.content;
        res.json({ message: { role: 'assistant', content: aiResponse } });
    }
    catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            message: {
                role: 'assistant',
                content: "I apologize, but I'm having trouble processing your request. Please try asking about our current movies and showtimes."
            }
        });
    }
});
// Helper function to format movie responses
function formatMovieResponse(movies, query) {
    // Check for specific question types
    const isActorQuery = query.includes('actor') || query.includes('cast') || query.includes('who plays');
    const isDirectorQuery = query.includes('director') || query.includes('directed by');
    const isGenreQuery = query.includes('genre') || query.includes('type of movie');
    const isRatingQuery = query.includes('rating') || query.includes('certification');
    const isLanguageQuery = query.includes('language') || query.includes('available in');
    const isPlotQuery = query.includes('about') || query.includes('plot') || query.includes('story');
    const isNewReleaseQuery = query.includes('new') || query.includes('latest') || query.includes('recent');
    let response = '';
    if (movies.length === 1) {
        const movie = movies[0];
        if (isActorQuery && movie.cast) {
            response = `🎭 The cast of "${movie.title}" includes: ${movie.cast.join(', ')}`;
        }
        else if (isDirectorQuery && movie.director) {
            response = `🎥 "${movie.title}" is directed by ${movie.director}`;
        }
        else if (isGenreQuery) {
            response = `🎬 "${movie.title}" belongs to the following genres: ${movie.genres}`;
        }
        else if (isRatingQuery) {
            response = `⭐ "${movie.title}" has a certification rating of ${movie.certification}`;
        }
        else if (isLanguageQuery) {
            response = `🌍 "${movie.title}" is available in: ${movie.languages}`;
        }
        else if (isPlotQuery && movie.description) {
            response = `📖 Here's what "${movie.title}" is about:\n\n${movie.description}`;
        }
        else {
            // Comprehensive movie details
            response = `🎬 **${movie.title}**\n\n`;
            if (movie.description)
                response += `${movie.description}\n\n`;
            response += `🎭 **Genre:** ${movie.genres}\n`;
            response += `🌍 **Language:** ${movie.languages}\n`;
            response += `⭐ **Certification:** ${movie.certification}\n`;
            if (movie.duration)
                response += `⏱️ **Duration:** ${movie.duration}\n`;
            if (movie.director)
                response += `🎥 **Director:** ${movie.director}\n`;
            if (movie.cast)
                response += `🎭 **Cast:** ${movie.cast.join(', ')}\n`;
            if (movie.releaseDate)
                response += `📅 **Release Date:** ${movie.releaseDate}\n`;
            if (movie.isNewRelease)
                response += `🆕 **New Release!**\n`;
        }
    }
    else if (isNewReleaseQuery) {
        const newReleases = movies.filter(m => m.isNewRelease);
        response = `🆕 Here are our new releases:\n\n${newReleases.map(m => `• **${m.title}** (${m.certification}) - ${m.genres}`).join('\n')}`;
    }
    else {
        response = `🎬 Found ${movies.length} movies that might interest you:\n\n${movies.map((m, i) => `${i + 1}. **${m.title}** (${m.certification})\n   • ${m.genres}\n   • ${m.languages}${m.isNewRelease ? '\n   • 🆕 New Release!' : ''}`).join('\n\n')}`;
    }
    return response + '\n\nWould you like to know more about any of these movies or book tickets?';
}
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
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
