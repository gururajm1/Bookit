import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedMovie } from '../redux/slices/movieSlice';

interface MovieCardProps {
  id: string;
  title: string;
  image: string;
  languages: string;
  certification: string;
  genres: string;
  isNewRelease?: boolean;
  releaseDate?: string;
  showSubtitles?: boolean;
}

const MovieCard = memo<MovieCardProps>(({
  id,
  title,
  image,
  languages,
  certification,
  genres,
  isNewRelease,
  releaseDate,
  showSubtitles
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBook = () => {
    // Dispatch movie data to Redux store
    dispatch(setSelectedMovie({
      id,
      title,
      image,
      languages,
      certification,
      genres,
      isNewRelease,
      releaseDate
    }));
    
    // Navigate to booking page
    navigate(`/movie/${id}/booking`);
  };

  const genreArray = genres.split(',').map((genre) => genre.trim());

  return (
    <div className="group h-full">
      <div className="relative h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
        {/* Image Container - Fixed Height */}
        <div className="relative h-[300px] overflow-hidden">
          <img
            loading="lazy"
            src={image}
            alt={title}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
          />
          {/* Overlay for New Release Badge */}
          {isNewRelease && (
            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              New Release
            </div>
          )}
        </div>

        {/* Content Container - Fixed Height with Scroll */}
        <div className="flex flex-col justify-between p-4 h-[200px]">
          {/* Title and Basic Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">{languages}</span>
              <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">{certification}</span>
              {showSubtitles && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm">
                  Subtitles
                </span>
              )}
            </div>
          </div>

          {/* Genres - Fixed Height with Scroll */}
          <div className="mb-2 h-[60px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            <div className="flex flex-wrap gap-2">
              {genreArray.map((genre, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 rounded-md text-sm whitespace-nowrap"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Release Date or Book Button */}
          <div className="mt-auto">
            {releaseDate ? (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Releasing:</span> {releaseDate}
              </div>
            ) : (
              <button
                onClick={handleBook}
                className="w-full py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-800 transition-colors"
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;