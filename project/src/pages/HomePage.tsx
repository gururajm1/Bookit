import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown, Star, Clock, Calendar, ArrowRight } from 'lucide-react';

// Featured movies data (this would typically come from an API)
const FEATURED_MOVIES = [
  {
    id: 'm1',
    title: 'Animal',
    image: 'https://m.media-amazon.com/images/I/91zTlD7AY1L.jpg',
    languages: 'Hindi',
    certification: 'A',
    genres: 'Action, Crime, Drama',
    isNewRelease: true,
  },
  {
    id: 'm2',
    title: 'Tiger 3',
    image: 'https://i.ytimg.com/vi/YJHFHmtVS_M/maxresdefault.jpg',
    languages: 'Hindi',
    certification: 'UA',
    genres: 'Action, Thriller',
    isNewRelease: true,
  },
  {
    id: 'm3',
    title: 'Fighter',
    image: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/fighter-et00304730-1704191105.jpg',
    languages: 'Hindi',
    certification: 'UA',
    genres: 'Action, Drama',
    isNewRelease: true,
  },
  {
    id: 'm4',
    title: 'Dunki',
    image: 'https://m.media-amazon.com/images/I/81ZRlUJlSTL._AC_UF894,1000_QL80_.jpg',
    languages: 'Hindi',
    certification: 'UA',
    genres: 'Comedy, Drama',
    isNewRelease: true,
  },
];

// Upcoming movies
const UPCOMING_MOVIES = [
  {
    id: 'um1',
    title: 'The Avengers: Next Chapter',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBlH-hb8HSGPrWEsRimv6aG_YWTSR27OsWRw&s',
    languages: 'English, Hindi',
    certification: 'UA',
    genres: 'Action, Adventure, Fantasy',
    releaseDate: '28 Apr, 2025',
  },
  {
    id: 'um2',
    title: 'Desert Storm',
    image: 'https://www.shutterstock.com/image-photo/us-soldier-desert-during-military-600nw-551691832.jpg',
    languages: 'Hindi, English',
    certification: 'UA',
    genres: 'Action, Drama, War',
    releaseDate: '15 May, 2025',
  },
  {
    id: 'um3',
    title: 'Cosmic Journey',
    image: 'https://m.media-amazon.com/images/M/MV5BMTQyMDEzNzA3MV5BMl5BanBnXkFtZTgwODgyMzQ2MTE@._V1_.jpg',
    languages: 'Hindi, English',
    certification: 'UA',
    genres: 'Sci-Fi, Adventure',
    releaseDate: '10 Jun, 2025',
  },
];

// Cities for location dropdown
const INDIAN_CITIES = [
  'Delhi-NCR', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Chandigarh', 'Kochi', 'Indore', 'Bhopal', 'Nagpur'
];

// Testimonials
const TESTIMONIALS = [
  {
    id: 1,
    name: 'Rahul Sharma',
    comment: 'Bookit made my movie night so much easier! Quick booking and great seat selection.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Priya Patel',
    comment: 'I love the interface and how easy it is to find new releases. Best booking platform!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Aakash Mehta',
    comment: 'The offers section saved me a lot of money. Great app for movie lovers!',
    rating: 4,
  },
];

// MovieCard Component
const MovieCard: React.FC<{
  id: string;
  title: string;
  image: string;
  languages: string;
  certification: string;
  genres: string;
  isNewRelease?: boolean;
  releaseDate?: string;
}> = ({
  id,
  title,
  image,
  languages,
  certification,
  genres,
  isNewRelease,
  releaseDate,
}) => {
  const navigate = useNavigate();
  const genreArray = genres.split(',').map((genre) => genre.trim());

  const handleBook = () => {
    // In a real app, this would navigate to the booking page
    // For the pre-authentication page, we'll redirect to login
    navigate('/login');
  };

  return (
    <div className="group h-full">
      <div className="relative h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
        {/* Image Container */}
        <div className="relative h-[320px] overflow-hidden">
          <img
            loading="lazy"
            src={image}
            alt={title}
            className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-110"
          />
          {/* New Release Badge */}
          {isNewRelease && (
            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              New Release
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="flex flex-col justify-between p-4 h-[180px]">
          {/* Title and Basic Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">{languages}</span>
              <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">{certification}</span>
            </div>
          </div>

          {/* Genres */}
          <div className="mb-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            <div className="flex flex-wrap gap-2">
              {genreArray.slice(0, 3).map((genre, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 rounded-md text-xs whitespace-nowrap"
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
                className="w-full py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard: React.FC<{
  name: string;
  comment: string;
  rating: number;
}> = ({ name, comment, rating }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
          {name.charAt(0)}
        </div>
        <div className="ml-3">
          <h4 className="font-semibold">{name}</h4>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600">{comment}</p>
    </div>
  );
};

// Features component
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Main HomePage Component
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Delhi-NCR');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setShowCityDropdown(false);
  };
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleSignup = () => {
    navigate('/signup');
  };

  // Handle click outside city dropdown to close it
  useEffect(() => {
    const handleClickOutside = () => {
      setShowCityDropdown(false);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-red-500 font-bold text-2xl">Bookit</Link>
            
            <div className="flex items-center space-x-4">

              <div className="relative">
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

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLogin}
                  className="px-4 py-1.5 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  Login
                </button>
                <button
                  onClick={handleSignup}
                  className="px-4 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <section className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Book Movie Tickets with Ease</h1>
              <p className="text-lg opacity-90 mb-8">The smartest way to book your movie tickets. No hassle, just entertainment.</p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <button 
                  onClick={handleSignup}
                  className="px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors w-full md:w-auto"
                >
                  Get Started
                </button>
                <button 
                  onClick={handleLogin}
                  className="px-6 py-3 bg-red-700 text-white font-semibold rounded-lg border border-white hover:bg-red-800 transition-colors w-full md:w-auto"
                >
                  I Already Have an Account
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Bookit?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Clock size={24} />}
                title="Quick Booking"
                description="Book your movie tickets in less than a minute with our streamlined process."
              />
              <FeatureCard 
                icon={<Calendar size={24} />}
                title="Book Tickets Hassle Free"
                description="Book tickets without any hassle and enjoy your movie time."
              />
              <FeatureCard 
                icon={<Star size={24} />}
                title="Exclusive Offers"
                description="Get access to special discounts and combo offers available only on Bookit."
              />
            </div>
          </div>
        </section>

        {/* Now Showing */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Now Showing</h2>
              <Link to="/login" className="text-red-600 hover:text-red-700 flex items-center">
                <span className="mr-1">View All</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {FEATURED_MOVIES.map((movie) => (
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
          </div>
        </section>

        {/* Coming Soon */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Coming Soon</h2>
              <Link to="/login" className="text-red-600 hover:text-red-700 flex items-center">
                <span className="mr-1">View All</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
              {UPCOMING_MOVIES.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  image={movie.image}
                  languages={movie.languages}
                  certification={movie.certification}
                  genres={movie.genres}
                  releaseDate={movie.releaseDate}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((testimonial) => (
                <TestimonialCard 
                  key={testimonial.id}
                  name={testimonial.name} 
                  comment={testimonial.comment} 
                  rating={testimonial.rating} 
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-red-600 to-red-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready for Your Next Movie Adventure?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">Join thousands of movie enthusiasts who book their tickets hassle-free with Bookit.</p>
            <button 
              onClick={handleSignup}
              className="px-8 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Create Your Account Now
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Bookit</h3>
              <p className="text-gray-400">The ultimate movie ticket booking platform for all your entertainment needs.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-400 hover:text-white">Movies</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white">Cinemas</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white">Offers</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white">Gift Cards</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Help & Support</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-400 hover:text-white">Contact Us</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white">FAQs</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Download Our App</h4>
              <p className="text-gray-400 mb-4">Get the best movie booking experience on your phone.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">App Store</span>
                  <div className="border border-gray-600 rounded px-3 py-2 flex items-center gap-2">
                    <div>iOS</div>
                  </div>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Google Play</span>
                  <div className="border border-gray-600 rounded px-3 py-2 flex items-center gap-2">
                    <div>Android</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Bookit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 