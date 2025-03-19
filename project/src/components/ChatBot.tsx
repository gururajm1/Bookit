import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Movie {
  id: string;
  title: string;
  image: string;
  languages: string;
  certification: string;
  genres: string;
  isNewRelease: boolean;
  description?: string;
  cast?: string;
  director?: string;
  duration?: string;
  rating?: number;
}

interface MovieContext {
  currentMovie?: Movie;
  selectedGenre?: string;
  selectedLanguage?: string;
  bookingStage?: 'initial' | 'movie_selected' | 'date_selected' | 'time_selected';
  preferredDate?: string;
  preferredTime?: string;
}

const ChatBot: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieContext, setMovieContext] = useState<MovieContext>({});
  const [lastRecommendedMovies, setLastRecommendedMovies] = useState<Movie[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "👋 Hi! I'm your movie booking assistant. I can help you:\n\n" +
                "• Find movies by genre, language, or preferences\n" +
                "• Get detailed movie information\n" +
                "• Help with the booking process\n" +
                "• Answer questions about showtimes and theaters\n\n" +
                "What kind of movie are you interested in watching?"
      }]);
    }
  }, []);
  
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:1004/bookit/movies');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const analyzeUserIntent = (query: string): {
    intent: string;
    entities: Record<string, string>;
  } => {
    const lowercaseQuery = query.toLowerCase();
    const entities: Record<string, string> = {};

    const genres = ['action', 'comedy', 'drama', 'horror', 'thriller', 'romance', 'sci-fi'];
    const foundGenre = genres.find(genre => lowercaseQuery.includes(genre));
    if (foundGenre) entities.genre = foundGenre;

    const languages = ['english', 'hindi', 'tamil', 'telugu'];
    const foundLanguage = languages.find(lang => lowercaseQuery.includes(lang));
    if (foundLanguage) entities.language = foundLanguage;

    if (lowercaseQuery.includes('morning')) entities.timing = 'morning';
    if (lowercaseQuery.includes('afternoon')) entities.timing = 'afternoon';
    if (lowercaseQuery.includes('evening')) entities.timing = 'evening';
    if (lowercaseQuery.includes('night')) entities.timing = 'night';

    if (lowercaseQuery.includes('book') || lowercaseQuery.includes('ticket')) {
      return { intent: 'booking', entities };
    }
    if (lowercaseQuery.includes('recommend') || lowercaseQuery.includes('suggest')) {
      return { intent: 'recommendation', entities };
    }
    if (lowercaseQuery.includes('about') || lowercaseQuery.includes('tell me more')) {
      return { intent: 'information', entities };
    }
    if (lowercaseQuery.includes('show') || lowercaseQuery.includes('time')) {
      return { intent: 'showtime', entities };
    }
    if (lowercaseQuery.includes('cancel') || lowercaseQuery.includes('refund')) {
      return { intent: 'cancellation', entities };
    }
    if (lowercaseQuery.includes('price') || lowercaseQuery.includes('cost')) {
      return { intent: 'pricing', entities };
    }

    return { intent: 'general', entities };
  };

  const generateMovieRecommendations = (query: string, context: MovieContext): string => {
    const { intent, entities } = analyzeUserIntent(query);
    let matchedMovies: Movie[] = [];
    
    switch (intent) {
      case 'booking':
        if (context.currentMovie) {
          return `Great! Let's book tickets for ${context.currentMovie.title}. Would you like to proceed with booking?`;
        }
        break;

      case 'information':
        if (context.currentMovie) {
          return generateDetailedMovieInfo(context.currentMovie);
        }
        break;

      case 'recommendation':
        matchedMovies = filterMoviesByPreferences(entities, movies);
        break;

      case 'showtime':
        if (context.currentMovie) {
          return "You can check the available showtimes on the booking page. Would you like me to take you there?";
        }
        break;

      default:
        matchedMovies = filterMoviesByPreferences(entities, movies);
    }

    if (matchedMovies.length > 0) {
      setLastRecommendedMovies(matchedMovies);
      return formatMovieRecommendations(matchedMovies, intent);
    }

    return "I couldn't find exact matches for your preferences. Would you like to see our latest releases or try different criteria?";
  };

  const filterMoviesByPreferences = (
    entities: Record<string, string>,
    movieList: Movie[]
  ): Movie[] => {
    let filtered = [...movieList];

    if (entities.genre) {
      filtered = filtered.filter(movie => 
        movie.genres.toLowerCase().includes(entities.genre!)
      );
    }

    if (entities.language) {
      filtered = filtered.filter(movie => 
        movie.languages.toLowerCase().includes(entities.language!)
      );
    }

    if (filtered.length === movieList.length) {
      filtered = filtered.filter(movie => movie.isNewRelease);
    }

    return filtered.slice(0, 5);
  };

  const generateDetailedMovieInfo = (movie: Movie): string => {
    return `
**${movie.title}** ${movie.isNewRelease ? '(New Release! 🎉)' : ''}

${movie.description || 'A captivating cinematic experience awaits you!'}

**Genre:** ${movie.genres}
**Language:** ${movie.languages}
**Certification:** ${movie.certification}
${movie.duration ? `**Duration:** ${movie.duration}` : ''}
${movie.director ? `**Director:** ${movie.director}` : ''}
${movie.cast ? `**Cast:** ${movie.cast}` : ''}
${movie.rating ? `**Rating:** ${'⭐'.repeat(Math.round(movie.rating))}` : ''}

Would you like to:
1. Book tickets for this movie
2. See showtimes
3. Check other similar movies
4. Go back to recommendations

Just let me know what you'd prefer!
    `.trim();
  };

  const formatMovieRecommendations = (movies: Movie[], intent: string): string => {
    const moviesList = movies.map(movie => 
      `• ${movie.title} (${movie.certification})
   ${movie.genres} | ${movie.languages}
   ${movie.isNewRelease ? '🆕 ' : ''}${movie.rating ? '⭐'.repeat(Math.round(movie.rating)) : ''}`
    ).join('\n\n');

    let response = '';
    if (intent === 'recommendation') {
      response = `Based on your preferences, here are some movies you might enjoy:\n\n${moviesList}`;
    } else {
      response = `Here are some movies you might like:\n\n${moviesList}`;
    }

    return `${response}\n\nWould you like to:\n1. Know more about any specific movie\n2. Book tickets\n3. See different recommendations`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const lowercaseInput = input.toLowerCase();
      let response: string;

      if (lastRecommendedMovies.length > 0 && 
          (lowercaseInput.includes('first') || lowercaseInput.includes('1'))) {
        const selectedMovie = lastRecommendedMovies[0];
        setMovieContext(prev => ({ ...prev, currentMovie: selectedMovie }));
        response = generateDetailedMovieInfo(selectedMovie);
      }
      else if (lowercaseInput.includes('book') && movieContext.currentMovie) {
        navigate(`/movie/${movieContext.currentMovie.id}/booking`);
        response = "Taking you to the booking page...";
      }
      else {
        response = generateMovieRecommendations(input, movieContext);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-xl border border-gray-200">
          <div className="h-96 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-red-500 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
