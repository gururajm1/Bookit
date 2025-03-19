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
  setSelectedShowTime,
  clearSelectedSeats
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
  const [seatCounts, setSeatCounts] = useState<Record<string, number>>({});
  
  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  // Function to get seat availability color
  const getAvailabilityColor = (count: number) => {
    if (count >= 210) return 'text-red-500 border-red-500';
    if (count >= 100) return 'text-yellow-500 border-yellow-500';
    return 'text-green-500 border-green-500';
  };

  // Function to fetch seat counts for a cinema and showtime
  const fetchSeatCount = async (cinema: Cinema, showTime: ShowTime) => {
    try {
      const formattedDate = format(selectedDate, 'dd-MM-yyyy');
      const response = await fetch(`http://localhost:1004/bookit/cinema/seats-count?theatreName=${encodeURIComponent(cinema.name)}&date=${encodeURIComponent(formattedDate)}&showTime=${encodeURIComponent(showTime.time)}&movieName=${encodeURIComponent(selectedMovie?.title || '')}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch seat count');
      }

      const data = await response.json();
      const key = `${cinema.name}-${showTime.time}`;
      setSeatCounts(prev => ({ ...prev, [key]: data.count }));
    } catch (error) {
      console.error('Error fetching seat count:', error);
    }
  };
  
  useEffect(() => {
    if (selectedLocation) {
      setIsLoading(true);
      dispatch(fetchCinemasByLocation(selectedLocation) as any)
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  }, [selectedLocation, dispatch]);

  // Fetch seat counts whenever cinemas, date, or movie changes
  useEffect(() => {
    if (cinemas && selectedMovie) {
      cinemas.forEach((cinema: Cinema) => {
        cinema.showTimes.forEach((showTime: ShowTime) => {
          fetchSeatCount(cinema, showTime);
        });
      });
    }
  }, [cinemas, selectedDate, selectedMovie]);
  
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
    
    // Clear any previously selected seats
    dispatch(clearSelectedSeats());
    
    dispatch(setSelectedCinema(cinema));
    dispatch(setSelectedShowTime({
      ...showTime,
      date: format(selectedDate, 'dd-MM-yyyy')
    }));
    
    // Navigate to the correct route with the movie ID
    navigate(`/movie/${selectedMovie?.id}/seats`);
  };

  // Render show time button with appropriate color
  const renderShowTimeButton = (cinema: Cinema, showTime: ShowTime) => {
    const key = `${cinema.name}-${showTime.time}`;
    const seatCount = seatCounts[key] || 0;
    const colorClass = getAvailabilityColor(seatCount);

    return (
      <button
        key={showTime.time}
        onClick={() => handleTimeClick(cinema, showTime)}
        className={`px-4 py-2 rounded border ${colorClass} hover:opacity-80 transition-opacity`}
      >
        {showTime.time}
      </button>
    );
  };
  
  if (!selectedMovie) {
    return <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Movie Header */}
      <div className="bg-gradient-to-b from-gray-100 to-white">
        <div className="container mx-auto px-4 py-6 pt-20">
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
      <div className="bg-gray-100 border-y border-gray-200">
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
            </div>
          </div>
        </div>
      </div>

      {/* Cinema List */}
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCinemas.map((cinema: Cinema) => (
              <div key={cinema.name} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{cinema.name}</h3>
                    <p className="text-sm text-gray-600">{cinema.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer" />
                    <span className="text-sm text-gray-600">{cinema.distance}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {cinema.showTimes.map((showTime) => renderShowTimeButton(cinema, showTime))}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
