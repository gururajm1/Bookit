import React, { useState, useMemo } from 'react';
import { Home, Clock, Film, Gift, Users, Import as Passport, Search, ChevronDown, MapPin } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedLocation, selectLocation } from '../redux/slices/movieSlice';
import { Link, useLocation } from 'react-router-dom';
import { debounce } from 'lodash';

// Sample movie data
const MOVIES = [
  { name: 'Inception', language: 'English', genre: 'Sci-Fi' },
  { name: '3 Idiots', language: 'Hindi', genre: 'Comedy' },
  { name: 'Parasite', language: 'Korean', genre: 'Thriller' },
  { name: 'Baahubali', language: 'Telugu', genre: 'Action' },
  { name: 'Dangal', language: 'Hindi', genre: 'Drama' },
];

const INDIAN_CITIES = [
  'Delhi-NCR', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Chandigarh', 'Kochi', 'Indore', 'Bhopal', 'Nagpur'
];

const Header = () => {
  const dispatch = useDispatch();
  const reduxLocation = useSelector(selectLocation);
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(reduxLocation || 'Delhi-NCR');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      // Dispatch custom event for MovieList component
      const searchEvent = new CustomEvent('movieSearch', {
        detail: { query }
      });
      window.dispatchEvent(searchEvent);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setShowCityDropdown(false);
    dispatch(setSelectedLocation(city));
    
    // Dispatch custom event for MovieList component
    const cityEvent = new CustomEvent('cityChange', {
      detail: { city }
    });
    window.dispatchEvent(cityEvent);
  };

  // Routes where header should be shown
  const showHeaderRoutes = ['/dash', '/movie', '/booked-tickets', '/showtimings', '/offers', '/investor', '/passport'];
  const shouldShowHeader = showHeaderRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {shouldShowHeader && (
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-red-500 font-bold text-2xl">Bookit</Link>
                <nav className="hidden md:flex items-center space-x-6">
                  <Link to="/" className="flex items-center space-x-1 text-sm hover:text-red-600">
                    <Home size={18} />
                    <span>Home</span>
                  </Link>
                  <Link to="/showtimings" className="flex items-center space-x-1 text-sm hover:text-red-600">
                    <Clock size={18} />
                    <span>Showtimings</span>
                  </Link>
                  <Link to="/booked-tickets" className="flex items-center space-x-1 text-sm hover:text-red-600">
                    <Film size={18} />
                    <span>Booked Tickets</span>
                  </Link>
                  <Link to="/offers" className="flex items-center space-x-1 text-sm hover:text-red-600">
                    <Gift size={18} />
                    <span>Offers</span>
                  </Link>
                  <Link to="/investor" className="flex items-center space-x-1 text-sm hover:text-red-600">
                    <Users size={18} />
                    <span>Investor Section</span>
                  </Link>
                  <Link to="/passport" className="flex items-center space-x-1 text-sm hover:text-red-600">
                    <Passport size={18} />
                    <span>Passport</span>
                  </Link>
                </nav>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by movie, languages or genre..."
                    className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-red-400 w-64 search-input"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-400 flex items-center space-x-1"
                  >
                    <MapPin className="text-gray-400" size={16} />
                    <span>{selectedCity}</span>
                    <ChevronDown size={16} />
                  </button>
                  {showCityDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 max-h-64 overflow-y-auto">
                      {INDIAN_CITIES.map((city) => (
                        <button
                          key={city}
                          onClick={() => handleCitySelect(city)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-400"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
      )}
    </>
  );
};

export default Header;
