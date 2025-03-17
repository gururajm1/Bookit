import React, { useState, useCallback, useRef } from 'react';
import { Home, Clock, Film, Gift, Users, Import as Passport, Menu, Search, User, ChevronDown } from 'lucide-react';

const INDIAN_CITIES = [
  'Delhi-NCR', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Chandigarh', 'Kochi', 'Indore', 'Bhopal', 'Nagpur'
];

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Delhi-NCR');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const searchTimeoutRef = useRef<number>();

  // Debounced search handler
  const debouncedSearch = useCallback((value: string) => {
    const searchEvent = new CustomEvent('movieSearch', { 
      detail: { query: value }
    });
    window.dispatchEvent(searchEvent);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    // Set new timeout
    searchTimeoutRef.current = window.setTimeout(() => debouncedSearch(value), 300);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setShowCityDropdown(false);
    // Dispatch city change event
    const cityEvent = new CustomEvent('cityChange', { 
      detail: { city } 
    });
    window.dispatchEvent(cityEvent);
  };

  return (
    <div>
      {window.location.pathname === "/" ? 
      (<header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <a href="/" className="text-red-500 font-bold text-2xl">Bookit</a>
              <nav className="hidden md:flex items-center space-x-6">
                <a href="/" className="flex items-center space-x-1 text-sm hover:text-red-600">
                  <Home size={18} />
                  <span>Home</span>
                </a>
                <a href="/showtimings" className="flex items-center space-x-1 text-sm hover:text-red-600">
                  <Clock size={18} />
                  <span>Showtimings</span>
                </a>
                <a href="/cinemas" className="flex items-center space-x-1 text-sm hover:text-red-600">
                  <Film size={18} />
                  <span>Cinemas</span>
                </a>
                <a href="/offers" className="flex items-center space-x-1 text-sm hover:text-red-600">
                  <Gift size={18} />
                  <span>Offers</span>
                </a>
                <a href="/investor" className="flex items-center space-x-1 text-sm hover:text-red-600">
                  <Users size={18} />
                  <span>Investor Section</span>
                </a>
                <a href="/passport" className="flex items-center space-x-1 text-sm hover:text-red-600">
                  <Passport size={18} />
                  <span>Passport</span>
                </a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by movie, language or genre..."
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-red-400 w-64"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-400 flex items-center space-x-1"
                >
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
      </header>) : ""}
    </div>
  );
};

export default Header;