import Dexie, { Table } from 'dexie';

export interface Movie {
  id: string;
  title: string;
  image: string;
  languages: string;
  certification: string;
  genres: string[];
  "isNewRelease"?: boolean;
  releaseDate?: string;
}

export class MovieDatabase extends Dexie {
  movies!: Table<Movie>;

  constructor() {
    super('MovieDatabase');
    this.version(1).stores({
      movies: '++id, title, languages, certification, "isNewRelease"'
    });
  }
}

export const db = new MovieDatabase(); 