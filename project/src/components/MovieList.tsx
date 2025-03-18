import { useState, useMemo, useRef, useEffect } from 'react';
import MovieCard from './MovieCard';
import Header from './Header';

interface Movie {
  id: string;
  title: string;
  image: string;
  languages: string;
  certification: string;
  genres: string;
  isNewRelease?: boolean;
  releaseDate?: string;
}

const createSearchCache = () => {
  return {
    get: (query: string) => {
      try {
        const cached = sessionStorage.getItem(`search:${query}`);
        return cached ? JSON.parse(cached) : null;
      } catch {
        return null;
      }
    },
    set: (query: string, results: Movie[]) => {
      try {
        sessionStorage.setItem(`search:${query}`, JSON.stringify(results));
      } catch {
        // Handle storage errors silently
      }
    },
    clear: () => {
      try {
        Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('search:')) {
          sessionStorage.removeItem(key);
        }
      });
      } catch {
        // Handle storage errors silently
      }
    }
  };
};

const ROWS_PER_LOAD = 3;
const MOVIES_PER_ROW = 5;

const MovieList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Delhi-NCR");
  const [visibleRows, setVisibleRows] = useState(ROWS_PER_LOAD);
  const observerTarget = useRef<HTMLDivElement>(null);
  const searchCache = useMemo(() => createSearchCache(), []);
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5000/bookit/movies'); // Updated URL to match server route
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
  
    fetchMovies();
  }, []);
  

  const filteredMovies = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const cacheKey = `${query}:${selectedCity}`;
    let results = null;

    if (query) {
      results = searchCache.get(cacheKey);
    }

    if (!results) {
      results = movies.filter(movie => {
        const matchesSearch = query === '' || 
          movie.title.toLowerCase().includes(query) ||
          movie.languages.toLowerCase().includes(query) ||
          (movie.genres && movie.genres.toLowerCase().includes(query));
        
        const matchesCity = selectedCity === "Delhi-NCR" || true; // For now, showing all movies
        
        return matchesSearch && matchesCity;
      });

      if (query) {
        searchCache.set(cacheKey, results);
      }
    }

    return results;
  }, [movies, searchQuery, selectedCity, searchCache]);

  useEffect(() => {
    const handleSearch = (event: CustomEvent<{ query: string }>) => {
      setSearchQuery(event.detail.query);
    };

    const handleCityChange = (event: CustomEvent<{ city: string }>) => {
      setSelectedCity(event.detail.city);
      searchCache.clear(); // Clear cache when city changes
    };

    window.addEventListener('movieSearch', handleSearch as EventListener);
    window.addEventListener('cityChange', handleCityChange as EventListener);

    return () => {
      window.removeEventListener('movieSearch', handleSearch as EventListener);
      window.removeEventListener('cityChange', handleCityChange as EventListener);
      searchCache.clear();
    };
  }, [searchCache]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleRows(prev => prev + ROWS_PER_LOAD);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, []);

  const visibleMovies = useMemo(() => {
    return filteredMovies?.slice(0, visibleRows * MOVIES_PER_ROW);
  }, [filteredMovies, visibleRows]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {visibleMovies?.map((movie: Movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            image={movie.image}
            languages={movie.languages}
            certification={movie.certification}
            genres={movie.genres}
            isNewRelease={movie.isNewRelease}
          />
        ))}
      </div>
      {visibleMovies?.length < filteredMovies?.length && (
        <div
          ref={observerTarget}
          className="h-20 flex items-center justify-center mt-8"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      )}
      {filteredMovies?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No movies found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default MovieList;