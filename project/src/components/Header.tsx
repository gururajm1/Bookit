import React, { useState, useMemo } from 'react';
import { Home, Clock, Film, Gift, Users, Import as Passport, Search, ChevronDown, MapPin, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedLocation, selectLocation } from '../redux/slices/movieSlice';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { isAuthenticated } from '../services/authService';

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
  const navigate = useNavigate();
  const reduxLocation = useSelector(selectLocation);
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(reduxLocation || 'Delhi-NCR');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
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
    
    const cityEvent = new CustomEvent('cityChange', {
      detail: { city }
    });
    window.dispatchEvent(cityEvent);
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated()) {
      navigate('/dash');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    
    setSearchQuery('');
    setSelectedCity('Delhi-NCR');
    setShowCityDropdown(false);
    
    navigate('/');
  };

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
                  <button onClick={handleHomeClick} className="flex items-center space-x-1 text-sm hover:text-red-600">
                    <Home size={18} />
                    <span>Home</span>
                  </button>
                  <Link to="/booked-tickets" className="flex items-center space-x-1 text-sm hover:text-red-600">
                    <Film size={18} />
                    <span>Booked Tickets</span>
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

                <div className="relative group">
                  <button
                    onClick={handleLogout}
                    className="group flex items-center justify-center space-x-1.5 px-4 py-1.5 bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md border border-gray-200 shadow-sm transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
                    title="Logout"
                  >
                    <LogOut size={16} className="text-gray-500 group-hover:text-red-500" />
                    <span className="hidden sm:inline font-medium">Logout</span>
                  </button>
                  <div className="absolute opacity-0 group-hover:opacity-100 bottom-full right-0 mb-1 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
                      Sign out
                    </div>
                  </div>
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
