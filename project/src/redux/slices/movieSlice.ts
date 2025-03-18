import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

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

interface MovieState {
  selectedMovie: Movie | null;
  loading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  selectedMovie: null,
  loading: false,
  error: null,
};

export const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    setSelectedMovie: (state, action: PayloadAction<Movie>) => {
      state.selectedMovie = action.payload;
      state.error = null;
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setSelectedMovie, clearSelectedMovie, setLoading, setError } = movieSlice.actions;

export const selectMovie = (state: RootState) => state.movie.selectedMovie;
export const selectMovieLoading = (state: RootState) => state.movie.loading;
export const selectMovieError = (state: RootState) => state.movie.error;

export default movieSlice.reducer;
