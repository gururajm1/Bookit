"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovies = void 0;
const Movie_1 = require("../models/Movie"); // Import the Movie model
const getMovies = async (req, res) => {
    try {
        const movies = await Movie_1.Movie.find({});
        res.status(200).json(movies);
    }
    catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ message: 'Failed to fetch movies' });
    }
};
exports.getMovies = getMovies;
