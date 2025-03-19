"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDetailedResponse = exports.analyzeMovieData = void 0;
const analyzeMovieData = (movies, query) => {
    const lowercaseQuery = query.toLowerCase();
    const words = lowercaseQuery.split(/\s+/);
    // Extract key terms
    const genres = extractGenres(query);
    const languages = extractLanguages(query);
    const certification = extractCertification(query);
    const isNewRelease = lowercaseQuery.includes('new') || lowercaseQuery.includes('latest');
    // Score and rank movies
    const analyzedMovies = movies.map(movie => {
        const analysis = {
            genreMatch: calculateGenreMatch(movie, genres),
            languageMatch: calculateLanguageMatch(movie, languages),
            certificationMatch: certification ? (movie.certification === certification ? 1 : 0) : 0.5,
            popularityScore: calculatePopularityScore(movie),
            relevanceScore: calculateRelevanceScore(movie, words)
        };
        return {
            movie,
            score: calculateTotalScore(analysis)
        };
    });
    // Sort by score and return top matches
    return analyzedMovies
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(item => item.movie);
};
exports.analyzeMovieData = analyzeMovieData;
const generateDetailedResponse = (movies, intent) => {
    if (movies.length === 0) {
        return "I couldn't find any movies matching your criteria. Would you like me to suggest some popular movies instead?";
    }
    if (intent.isBookingQuery) {
        return generateBookingResponse(movies[0]);
    }
    if (intent.isDetailsQuery) {
        return generateDetailedMovieInfo(movies[0]);
    }
    if (intent.isReviewQuery) {
        return generateReviewResponse(movies[0]);
    }
    if (intent.isShowtimeQuery) {
        return generateShowtimeResponse(movies[0]);
    }
    // Default to recommendations
    return generateRecommendationResponse(movies);
};
exports.generateDetailedResponse = generateDetailedResponse;
const extractGenres = (query) => {
    const genres = [
        'action', 'adventure', 'comedy', 'drama', 'horror',
        'thriller', 'romance', 'sci-fi', 'fantasy', 'animation',
        'documentary', 'crime', 'mystery', 'family'
    ];
    return genres.filter(genre => query.toLowerCase().includes(genre));
};
const extractLanguages = (query) => {
    const languages = ['english', 'hindi', 'tamil', 'telugu', 'malayalam', 'kannada'];
    return languages.filter(lang => query.toLowerCase().includes(lang));
};
const extractCertification = (query) => {
    const certifications = ['U', 'U/A', 'A'];
    const found = certifications.find(cert => query.toLowerCase().includes(cert.toLowerCase()));
    return found || '';
};
const calculateGenreMatch = (movie, queryGenres) => {
    if (queryGenres.length === 0)
        return 0.5;
    const movieGenres = movie.genres.toLowerCase().split(',').map(g => g.trim());
    const matches = queryGenres.filter(g => movieGenres.includes(g));
    return matches.length / queryGenres.length;
};
const calculateLanguageMatch = (movie, queryLanguages) => {
    if (queryLanguages.length === 0)
        return 0.5;
    const movieLanguages = movie.languages.toLowerCase().split(',').map(l => l.trim());
    const matches = queryLanguages.filter(l => movieLanguages.includes(l));
    return matches.length / queryLanguages.length;
};
const calculatePopularityScore = (movie) => {
    // Implement popularity scoring based on reviews, ratings, etc.
    return movie.rating ? movie.rating / 5 : 0.5;
};
const calculateRelevanceScore = (movie, queryWords) => {
    const relevantWords = queryWords.filter(word => {
        var _a, _b, _c, _d;
        return movie.title.toLowerCase().includes(word) ||
            ((_b = (_a = movie.description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(word)) !== null && _b !== void 0 ? _b : false) ||
            ((_d = (_c = movie.cast) === null || _c === void 0 ? void 0 : _c.some(actor => actor.toLowerCase().includes(word))) !== null && _d !== void 0 ? _d : false);
    });
    return relevantWords.length / queryWords.length || 0.5;
};
const calculateTotalScore = (analysis) => {
    return (analysis.genreMatch * 0.3 +
        analysis.languageMatch * 0.2 +
        analysis.certificationMatch * 0.1 +
        analysis.popularityScore * 0.2 +
        analysis.relevanceScore * 0.2);
};
const generateDetailedMovieInfo = (movie) => {
    var _a;
    return `🎬 **${movie.title}**

${movie.description ? `${movie.description}\n\n` : ''}

🎭 **Genre:** ${movie.genres}
🌍 **Language:** ${movie.languages}
⭐ **Certification:** ${movie.certification}
${movie.duration ? `⏱️ **Duration:** ${movie.duration}\n` : ''}
${movie.director ? `🎥 **Director:** ${movie.director}\n` : ''}
${((_a = movie.cast) === null || _a === void 0 ? void 0 : _a.length) ? `🎭 **Cast:** ${movie.cast.join(', ')}\n` : ''}
${movie.releaseDate ? `📅 **Release Date:** ${movie.releaseDate}\n` : ''}
${movie.isNewRelease ? '🆕 **New Release!**\n' : ''}

Would you like to:
1. Book tickets for this movie
2. See showtimes and availability
3. Read reviews
4. Get similar recommendations`;
};
const generateBookingResponse = (movie) => {
    return `🎟️ Ready to book tickets for **${movie.title}**!

Here's what you need to know:
• Multiple showtimes available daily
• Choose from various theaters in your area
• Select your preferred seats
• Secure payment options

Would you like me to:
1. Show available showtimes
2. Help you find the nearest theater
3. Guide you through the booking process
4. Show ticket prices`;
};
const generateReviewResponse = (movie) => {
    var _a;
    if (!((_a = movie.reviews) === null || _a === void 0 ? void 0 : _a.length)) {
        return `No reviews available for **${movie.title}** yet. Would you like to:
1. Be the first to review
2. See critic ratings
3. View similar movies with reviews
4. Book tickets anyway`;
    }
    const avgRating = movie.reviews.reduce((sum, r) => sum + r.rating, 0) / movie.reviews.length;
    return `📊 Reviews for **${movie.title}**

⭐ Average Rating: ${avgRating.toFixed(1)}/5
📝 Total Reviews: ${movie.reviews.length}

${movie.reviews.slice(0, 3).map(review => `
> "${review.comment}"
> - ⭐ ${review.rating}/5 (${new Date(review.date).toLocaleDateString()})`).join('\n')}

Would you like to:
1. Read more reviews
2. Write your own review
3. Book tickets
4. See similar highly-rated movies`;
};
const generateShowtimeResponse = (movie) => {
    return `🕒 Showtimes for **${movie.title}**

Today's shows:
• Morning: 10:30 AM, 11:45 AM
• Afternoon: 2:15 PM, 3:30 PM
• Evening: 6:00 PM, 7:15 PM
• Night: 9:45 PM, 10:30 PM

Select a showtime to:
1. Check seat availability
2. View ticket prices
3. Start booking process
4. See other dates`;
};
const generateRecommendationResponse = (movies) => {
    const recommendations = movies.map((movie, index) => `${index + 1}. **${movie.title}** (${movie.certification})
   • ${movie.genres}
   • ${movie.languages}
   ${movie.isNewRelease ? '• 🆕 New Release!' : ''}`).join('\n\n');
    return `🎯 Here are some movies you might enjoy:\n\n${recommendations}\n\nYou can:
1. Ask for more details about any movie
2. Book tickets
3. See showtimes
4. Get more recommendations`;
};
