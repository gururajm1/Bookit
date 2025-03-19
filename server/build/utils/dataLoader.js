"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMovies = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define the movie schema
const movieSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    languages: { type: String, required: true },
    certification: { type: String, required: true },
    genres: { type: String, required: true },
    isNewRelease: { type: Boolean, required: true },
    description: { type: String },
    cast: [{ type: String }],
    director: { type: String },
    duration: { type: String },
    releaseDate: { type: String },
    rating: { type: Number },
    reviews: [{
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
            userId: { type: String, required: true },
            date: { type: Date, required: true }
        }]
});
// Create the model
const MovieModel = mongoose_1.default.model('Movie', movieSchema);
const loadMovies = async () => {
    try {
        const movies = await MovieModel.find({}).lean();
        return movies.map(movie => ({
            id: movie._id.toString(),
            title: movie.title,
            image: movie.image,
            languages: movie.languages,
            certification: movie.certification,
            genres: movie.genres,
            isNewRelease: movie.isNewRelease,
            description: movie.description || undefined,
            cast: movie.cast || [],
            director: movie.director || undefined,
            duration: movie.duration || undefined,
            releaseDate: movie.releaseDate || undefined,
            rating: movie.rating || undefined,
            reviews: (movie.reviews || []).map(review => ({
                rating: review.rating,
                comment: review.comment,
                userId: review.userId,
                date: review.date
            }))
        }));
    }
    catch (error) {
        console.error('Error loading movies:', error);
        return [];
    }
};
exports.loadMovies = loadMovies;
