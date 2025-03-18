import { db } from './db';

export const initializeMovies = async () => {
  try {
    // Check if movies already exist in the database
    const existingMovies = await db.movies.count();
    
    if (existingMovies === 0) {
      // Only insert if no movies exist
      const movies = [
        // Hindi Movies
        {
          id: "dunki",
          title: "Dunki",
          image: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd",
          languages: "Hindi",
          certification: "U/A",
          genres: ["Comedy", "Drama"],
          "isNewRelease": true
        },
        {
          id: "animal",
          title: "Animal",
          image: "https://images.unsplash.com/photo-1543536448-1e76fc2795bf",
          languages: "Hindi",
          certification: "A",
          genres: ["Action", "Crime", "Drama"],
          "isNewRelease": true
        },
        // ... Add all other movies from the original list
      ];

      await db.movies.bulkAdd(movies);
      console.log('Movies initialized successfully');
    } else {
      console.log('Movies already exist in the database');
    }
  } catch (error) {
    console.error('Error initializing movies:', error);
  }
}; 