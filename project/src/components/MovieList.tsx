import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import MovieCard from './MovieCard';
import ChatBot from './ChatBot';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';

// Simple image cache for preloading
const imageCache = new Map<string, HTMLImageElement>();

// Simple image preloading function
const preloadImages = async (srcs: string[]): Promise<void> => {
  const promises = srcs.map(src => {
    return new Promise<void>((resolve) => {
      if (imageCache.has(src)) {
        resolve();
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        imageCache.set(src, img);
        resolve();
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        resolve(); // Resolve anyway to not block other images
      };
      img.src = src;
    });
  });
  
  await Promise.all(promises);
};

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

const MOVIES_PER_ROW = 5;
const ITEMS_PER_PAGE = 20; // Increased items per page for smoother scrolling
const SCROLL_THRESHOLD = 800; // Increased threshold for earlier loading

const MovieList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Delhi-NCR");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Memoized search cache with Map for better performance
  const searchCache = useMemo(() => {
    const cache = new Map<string, Movie[]>();
    return {
      get: (key: string) => cache.get(key),
      set: (key: string, value: Movie[]) => cache.set(key, value),
      clear: () => cache.clear()
    };
  }, []);

  // Initial fetch of all movies
  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:1004/bookit/movies');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        setAllMovies(data);
        
        // Set initial movies with more items for smoother initial render
        const initialMovies = data.slice(0, ITEMS_PER_PAGE);
        setMovies(initialMovies);
        
        // Preload next batch of images
        const nextBatchImages = data
          .slice(ITEMS_PER_PAGE, ITEMS_PER_PAGE * 2)
          .map((movie: Movie) => movie.image);
        preloadImages(nextBatchImages).catch(console.error);
        
        setInitialLoadComplete(true);
        setHasMore(data.length > ITEMS_PER_PAGE);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchAllMovies();
  }, []);

  // Optimized load more function with debouncing
  const loadMore = useCallback(
    debounce(async () => {
      if (isLoading || !hasMore || !initialLoadComplete) return;
      
      setIsLoading(true);
      
      try {
        const nextPage = page + 1;
        const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
        const endIndex = nextPage * ITEMS_PER_PAGE;
        const newMovies = allMovies.slice(startIndex, endIndex);
        
        if (newMovies.length > 0) {
          // Preload images for next batch
          const imageUrls = newMovies.map(movie => movie.image);
          await preloadImages(imageUrls);
          
          setMovies(prev => [...prev, ...newMovies]);
          setPage(nextPage);
          setHasMore(endIndex < allMovies.length);
          
          // Preload next batch images
          const nextBatchImages = allMovies
            .slice(endIndex, endIndex + ITEMS_PER_PAGE)
            .map(movie => movie.image);
          preloadImages(nextBatchImages).catch(console.error);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error loading more movies:', error);
      } finally {
        setIsLoading(false);
      }
    }, 150), // Debounce time for smoother loading
    [page, isLoading, hasMore, allMovies, initialLoadComplete]
  );

  // Optimized scroll handler
  const handleScroll = useCallback(
    debounce(() => {
      if (!containerRef.current || isLoading || !hasMore) return;
      
      const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
      const scrollBottom = scrollHeight - scrollTop - clientHeight;
      
      if (scrollBottom < SCROLL_THRESHOLD) {
        loadMore();
      }
    }, 50), // Small debounce for scroll events
    [loadMore, isLoading, hasMore]
  );

  // Scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Filtered movies with memoization
  const filteredMovies = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const cacheKey = `${query}:${selectedCity}`;
    let results = searchCache.get(cacheKey);

    if (!results) {
      results = movies.filter(movie => {
        const matchesSearch = query === '' || 
          movie.title.toLowerCase().includes(query) ||
          movie.languages.toLowerCase().includes(query) ||
          movie.genres.toLowerCase().split(',').some(genre => 
            genre.trim().toLowerCase().includes(query)
          );
        
        return matchesSearch;
      });
      
      // Sort results by relevance
      if (query) {
        results.sort((a, b) => {
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          const aGenres = a.genres.toLowerCase();
          const bGenres = b.genres.toLowerCase();
          
          // Exact title matches first
          if (aTitle === query && bTitle !== query) return -1;
          if (bTitle === query && aTitle !== query) return 1;
          
          // Title starts with query next
          if (aTitle.startsWith(query) && !bTitle.startsWith(query)) return -1;
          if (bTitle.startsWith(query) && !aTitle.startsWith(query)) return 1;
          
          // Genre matches next
          const aGenreMatch = aGenres.split(',').some(g => g.trim().toLowerCase() === query);
          const bGenreMatch = bGenres.split(',').some(g => g.trim().toLowerCase() === query);
          if (aGenreMatch && !bGenreMatch) return -1;
          if (bGenreMatch && !aGenreMatch) return 1;
          
          // Default to alphabetical
          return aTitle.localeCompare(bTitle);
        });
      }
      
      if (query) searchCache.set(cacheKey, results);
    }

    return results || [];
  }, [movies, searchQuery, selectedCity, searchCache]);

  // Event listeners for search and city change
  useEffect(() => {
    const handleSearch = (event: CustomEvent<{ query: string }>) => {
      setSearchQuery(event.detail.query);
      // Clear the cache when search query changes
      searchCache.clear();
    };

    const handleCityChange = (event: CustomEvent<{ city: string }>) => {
      setSelectedCity(event.detail.city);
      searchCache.clear();
    };

    window.addEventListener('movieSearch', handleSearch as EventListener);
    window.addEventListener('cityChange', handleCityChange as EventListener);

    return () => {
      window.removeEventListener('movieSearch', handleSearch as EventListener);
      window.removeEventListener('cityChange', handleCityChange as EventListener);
    };
  }, [searchCache]);

  // Update the styles useEffect
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Hide scrollbar for Chrome, Safari and Opera */
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }

      /* Hide scrollbar for IE, Edge and Firefox */
      .hide-scrollbar {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
      }

      /* Movie card hover effect */
      .movie-card-wrapper {
        transition: all 0.3s ease;
      }

      .movie-card-wrapper:hover {
        transform: translateY(-4px);
      }

      /* Gradient overlay for smooth edges */
      .container-gradient::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100px;
        background: linear-gradient(to bottom, transparent, #f9fafb);
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-[2000px] mx-auto">
        <div 
          ref={containerRef}
          className="relative h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden hide-scrollbar"
          style={{
            perspective: '1001px',
            backfaceVisibility: 'hidden',
            transform: 'translate3d(0,0,0)',
            willChange: 'transform',
            WebkitOverflowScrolling: 'touch',
            scrollPaddingBottom: '100px',
            overscrollBehavior: 'none'
          }}
        >
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 xl:gap-8 p-8"
            style={{
              minHeight: '100%',
              paddingBottom: '120px',
              width: '100%',
              maxWidth: '100%',
              margin: '0 auto'
            }}
          >
            {filteredMovies.map((movie: Movie) => (
              <div
                key={movie.id}
                className="transform transition-all duration-300 ease-out hover:scale-105 hover:z-10 relative w-full"
                style={{
                  willChange: 'transform, z-index',
                  backfaceVisibility: 'hidden'
                }}
              >
                <div className="movie-card-wrapper rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 w-full">
                  <MovieCard
                    id={movie.id}
                    title={movie.title}
                    image={movie.image}
                    languages={movie.languages}
                    certification={movie.certification}
                    genres={movie.genres}
                    isNewRelease={movie.isNewRelease}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Loading indicator */}
          {(isLoading || hasMore) && (
            <div
              ref={loadingRef}
              className="flex items-center justify-center py-8 relative"
              style={{ 
                minHeight: '100px',
                background: 'transparent'
              }}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-400"></div>
                <span className="text-gray-500 text-sm">Loading more movies...</span>
              </div>
            </div>
          )}
        </div>

        {/* ChatBot with fixed positioning and improved styling */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="chatbot-container chatbot-shadow rounded-full">
            <ChatBot />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieList;