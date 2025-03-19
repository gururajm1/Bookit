import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
  id: string;
  title: string;
  image: string;
  languages: string;
  certification: string;
  genres: string;
  isNewRelease: boolean;
}

const movieSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  languages: {
    type: String,
    required: true
  },
  certification: {
    type: String,
    required: true
  },
  genres: {
    type: String,
    required: true
  },
  isNewRelease: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'movies'
});

export const Movie = mongoose.model<IMovie>('Movie', movieSchema);
