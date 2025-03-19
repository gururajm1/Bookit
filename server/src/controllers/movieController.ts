import { Request, Response } from 'express';
import { Movie } from '../models/Movie'; 

const getMovies = async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find({});
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Failed to fetch movies' });
  }
};

export { getMovies };
