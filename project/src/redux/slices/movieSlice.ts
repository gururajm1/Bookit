import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cinemaLocations, Cinema as CinemaType } from '../../data/locations';

// Define types
export interface Movie {
  id: string;
  title: string;
  image: string;
  languages: string;
  certification: string;
  genres: string;
  isNewRelease?: boolean;
  releaseDate?: string;
}

interface CinemaShowTime {
  time: string;
  date: string;
  languages: string;
  isFull: boolean;
  isEmpty: boolean;
}

export interface Cinema {
  id: number;
  name: string;
  address: string;
  distance: string;
  location: string;
  showTimes: CinemaShowTime[];
  seatsBooked: string[];
  price: number;
}

interface MovieState {
  selectedMovie: Movie | null;
  selectedLocation: string;
  selectedCinema: CinemaType | null;
  selectedShowTime: CinemaShowTime | null;
  selectedSeats: string[];
  cachedMovies: {
    data: Movie[] | null;
    lastFetched: number;
  };
  cinemas: CinemaType[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: MovieState = {
  selectedMovie: null,
  selectedLocation: 'Delhi-NCR',
  selectedCinema: null,
  selectedShowTime: null,
  selectedSeats: [],
  cachedMovies: {
    data: null,
    lastFetched: 0
  },
  cinemas: [],
  loading: false,
  error: null
};

// Cache validation time (15 minutes in milliseconds)
const CACHE_REVALIDATION_TIME = 15 * 60 * 1000;

// Async thunk for fetching movies with cache
export const fetchMoviesWithCache = createAsyncThunk(
  'movies/fetchWithCache',
  async (_, { getState }) => {
    const state = getState() as { movies: MovieState };
    const { data, lastFetched } = state.movies.cachedMovies;
    const currentTime = Date.now();
    
    // Check if cache is valid (less than 15 minutes old)
    if (data && (currentTime - lastFetched) < CACHE_REVALIDATION_TIME) {
      return data;
    }
    
    // If cache is invalid or doesn't exist, fetch new data
    // This would typically be an API call
    // For now, we'll return an empty array as a placeholder
    return [];
  }
);

// Async thunk for fetching cinemas by location
export const fetchCinemasByLocation = createAsyncThunk(
  'movies/fetchCinemasByLocation',
  async (location: string) => {
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter cinemas by location from our mock database
    return cinemaLocations.filter(cinema => cinema.location === location);
  }
);

// Create the slice
const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSelectedMovie: (state, action: PayloadAction<Movie>) => {
      state.selectedMovie = action.payload;
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
    },
    setSelectedLocation: (state, action: PayloadAction<string>) => {
      state.selectedLocation = action.payload;
    },
    setSelectedCinema: (state, action: PayloadAction<CinemaType>) => {
      state.selectedCinema = action.payload;
    },
    setSelectedShowTime: (state, action: PayloadAction<CinemaShowTime>) => {
      state.selectedShowTime = action.payload;
    },
    addSelectedSeat: (state, action: PayloadAction<string>) => {
      if (!state.selectedSeats.includes(action.payload)) {
        state.selectedSeats.push(action.payload);
      }
    },
    removeSelectedSeat: (state, action: PayloadAction<string>) => {
      state.selectedSeats = state.selectedSeats.filter(seat => seat !== action.payload);
    },
    clearSelectedSeats: (state) => {
      state.selectedSeats = [];
    },
    setCachedMovies: (state, action: PayloadAction<Movie[]>) => {
      state.cachedMovies = {
        data: action.payload,
        lastFetched: Date.now()
      };
    },
    invalidateCache: (state) => {
      state.cachedMovies.lastFetched = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoviesWithCache.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoviesWithCache.fulfilled, (state, action) => {
        state.loading = false;
        state.cachedMovies = {
          data: action.payload,
          lastFetched: Date.now()
        };
      })
      .addCase(fetchMoviesWithCache.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      })
      .addCase(fetchCinemasByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCinemasByLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.cinemas = action.payload;
      })
      .addCase(fetchCinemasByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cinemas';
      });
  }
});

// Export actions
export const { 
  setSelectedMovie, 
  clearSelectedMovie, 
  setSelectedLocation,
  setSelectedCinema,
  setSelectedShowTime,
  addSelectedSeat,
  removeSelectedSeat,
  clearSelectedSeats,
  setCachedMovies,
  invalidateCache
} = movieSlice.actions;

// Export selectors
export const selectMovie = (state: { movies: MovieState }) => state.movies.selectedMovie;
export const selectLocation = (state: { movies: MovieState }) => state.movies.selectedLocation;
export const selectCinema = (state: { movies: MovieState }) => state.movies.selectedCinema;
export const selectShowTime = (state: { movies: MovieState }) => state.movies.selectedShowTime;
export const selectSeats = (state: { movies: MovieState }) => state.movies.selectedSeats;
export const selectCachedMovies = (state: { movies: MovieState }) => state.movies.cachedMovies;
export const selectCinemas = (state: { movies: MovieState }) => state.movies.cinemas;
export const selectLoading = (state: { movies: MovieState }) => state.movies.loading;
export const selectError = (state: { movies: MovieState }) => state.movies.error;

// Export reducer
export default movieSlice.reducer;
