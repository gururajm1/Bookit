import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format, addDays } from 'date-fns';
import { ChevronLeft, Search, MapPin, Heart } from 'lucide-react';
import { 
  selectMovie, 
  selectLocation, 
  selectCinemas, 
  fetchCinemasByLocation, 
  setSelectedCinema,
  setSelectedShowTime
} from '../redux/slices/movieSlice';
import { Cinema, CinemaShowTime } from '../data/locations';
import Header from './Header';
import { isAuthenticated } from '../services/authService';

interface ShowTime {
  time: string;
  languages: string;
  isFull: boolean;
  isEmpty: boolean;
}

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const selectedMovie = useSelector(selectMovie);
  const selectedLocation = useSelector(selectLocation);
  const cinemas = useSelector(selectCinemas);
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  
  useEffect(() => {
    if (selectedLocation) {
      setIsLoading(true);
      dispatch(fetchCinemasByLocation(selectedLocation) as any)
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  }, [selectedLocation, dispatch]);
  
  // Filter cinemas based on search query and time filter
  const filteredCinemas = cinemas.filter((cinema: Cinema) => {
    const matchesSearch = cinema.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         cinema.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTime = timeFilter === '' || 
                       cinema.showTimes.some(show => show.time.includes(timeFilter));
    
    return matchesSearch && matchesTime;
  });
  
  const handleTimeClick = (cinema: Cinema, showTime: ShowTime) => {
    console.log('Clicked on showtime:', showTime);
    console.log('Selected movie ID:', selectedMovie?.id);
    console.log('Is authenticated:', isAuthenticated());
    
    if (!isAuthenticated()) {
      // Save the current state before redirecting
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/login');
      return;
    }
    
    dispatch(setSelectedCinema(cinema));
    dispatch(setSelectedShowTime(showTime));
    
    // Navigate to the correct route with the movie ID
    navigate(`/movie/${selectedMovie?.id}/seats`);
  };
  
  if (!selectedMovie) {
    return <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Include Header Component */}
      <Header />
      
      {/* Movie Header */}
      <div className="bg-gradient-to-b from-gray-100 to-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center text-gray-800 gap-4">
            <button className="hover:text-red-500" onClick={() => navigate('/dash')}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{selectedMovie.title}</h1>
              <div className="flex items-center gap-2 text-sm mt-1">
                <span className="px-2 py-0.5 border border-gray-300 rounded">{selectedMovie.certification}</span>
                <span>{selectedMovie.languages}</span>
                <span>•</span>
                <span>{selectedMovie.genres}</span>
                {selectedMovie.isNewRelease && <span className="text-red-500">• New Release</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Display */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="font-medium text-gray-700">Location: {selectedLocation}</span>
            </div>
            <button 
              className="text-sm text-red-500 hover:text-red-600 font-medium"
              onClick={() => navigate('/dash')}
            >
              Change Location
            </button>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className="border-t border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 py-4 overflow-x-auto">
            {dates.map((date, i) => (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center p-2 rounded ${
                  date.toDateString() === selectedDate.toDateString()
                    ? 'bg-red-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-sm">{format(date, 'EEE')}</span>
                <span className="text-xl font-bold">{format(date, 'd')}</span>
                <span className="text-sm">{format(date, 'MMM')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for cinema"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-red-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 overflow-x-auto">
              <select 
                className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-red-400"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="">All Times</option>
                <option value="AM">Morning Shows</option>
                <option value="PM">Evening Shows</option>
                <option value="12:">12 PM Shows</option>
                <option value="03:">3 PM Shows</option>
                <option value="06:">6 PM Shows</option>
                <option value="09:">9 PM Shows</option>
              </select>
              <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-red-400">
                <option>Languages</option>
                <option>ENGLISH</option>
                <option>HINDI</option>
                <option>TAMIL</option>
              </select>
              <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-red-400">
                <option>Formats</option>
                <option>2D</option>
                <option>3D</option>
                <option>IMAX</option>
              </select>
              <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-red-400">
                <option>Accessibility</option>
                <option>Wheelchair Access</option>
                <option>Audio Description</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Cinema List */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
            </div>
          ) : filteredCinemas.length > 0 ? (
            filteredCinemas.map((cinema: Cinema) => (
              <div key={cinema.id} className="bg-white rounded-lg p-6 mb-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-xl font-bold">{cinema.name}</h2>
                    <p className="text-sm text-gray-500">{cinema.address}</p>
                    <p className="text-sm text-gray-500">Price: ₹{cinema.price}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{cinema.distance}</span>
                    <button className="text-gray-600 hover:text-red-500">
                      <MapPin className="w-5 h-5" />
                    </button>
                    <button className="text-gray-600 hover:text-red-500">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 mt-4 flex-wrap">
                  {cinema.showTimes.map((show: CinemaShowTime, index: number) => {
                    const buttonStyle = show.isFull ? "border-red-500 text-red-500" :
                                      !show.isEmpty ? "border-yellow-500 text-yellow-500" :
                                      "border-green-500 text-green-500";
                    return (
                      <button
                        key={index}
                        onClick={() => handleTimeClick(cinema, show)}
                        className={`px-6 py-3 border rounded text-center transition-colors ${buttonStyle}`}
                        disabled={show.isFull}
                      >
                        <span className="block text-sm">{show.languages}</span>
                        <span className="block font-bold mt-1">{show.time}</span>
                        {show.isFull && <span className="text-xs block mt-1">FULL</span>}
                        {show.isEmpty && <span className="text-xs block mt-1">AVAILABLE</span>}
                        {!show.isFull && !show.isEmpty && <span className="text-xs block mt-1">FILLING</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No cinemas found for {selectedLocation}</p>
              <p className="text-sm text-gray-400 mt-2">Try changing your location or search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;