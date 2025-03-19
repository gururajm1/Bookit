import React, { useState, useEffect } from 'react';
import adminService, { DashboardData } from '../services/adminService';
import { Users, UserCheck, Ticket, Calendar, Film, MapPin, Search, Download, Clock, CreditCard, Eye, ChevronDown, ChevronUp, Theater, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface IShowTime {
  time: string;
  bookedSeats: string[];
  movieName: string;
}

interface ISeatAvailability {
  date: string;
  seats: string[];
  showTimes?: IShowTime[];
}

interface ICinema {
  _id: string;
  name: string;
  address: string;
  distance: string;
  location: string;
  isFull: boolean;
  isEmpty: boolean;
  dates: ISeatAvailability[];
}

interface TheaterSeatData {
  theaterId: string;
  theaterName: string;
  location: string;
  address: string;
  shows: TheaterShow[];
}

interface TheaterShow {
  showId: string;
  movieName: string;
  date: string;
  time: string;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'movies' | 'theaters' | 'bookings'>('overview');
  const [expandedTheaters, setExpandedTheaters] = useState<string[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);   
        const data = await adminService.getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const toggleTheaterExpand = (theaterId: string) => {
    setExpandedTheaters(prev => 
      prev.includes(theaterId) 
        ? prev.filter(id => id !== theaterId) 
        : [...prev, theaterId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white border-l-4 border-red-500 rounded-lg p-8 max-w-md shadow-lg">
          <h2 className="text-red-600 text-2xl font-bold mb-3">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300 shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const formatSeats = (seats: string[]) => {
    if (!seats || seats.length === 0) return 'None';
    
    if (seats.length <= 5) {
      return seats.join(', ');
    }
    
    return `${seats.slice(0, 3).join(', ')} +${seats.length - 3} more`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header with Logo and Navigation */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-3xl font-bold text-red-600">Bookit</h1>
            </Link>
            <div className="ml-8 bg-gray-100 rounded-md py-1 px-2 text-sm text-gray-600">
              Admin Dashboard
            </div>
          </div>
        </header>

        {/* Project Details Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Bookit Admin Panel</h2>
                <div className="flex items-center mt-1">
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded mr-2">Admin</span>
                  <span className="text-gray-500 text-sm">Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-b-2 border-red-500 text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('movies')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'movies'
                  ? 'border-b-2 border-red-500 text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setActiveTab('theaters')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'theaters'
                  ? 'border-b-2 border-red-500 text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Theaters
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'bookings'
                  ? 'border-b-2 border-red-500 text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Bookings
            </button>
          </nav>
        </div>

        {/* Main Content Area - changes based on active tab */}
        {activeTab === 'overview' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Users Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users size={20} className="text-blue-600" />
                  </div>
                </div>
                <h3 className="text-sm text-gray-500 mb-1">Total Users</h3>
                <p className="text-2xl font-bold text-gray-800">{dashboardData.totalUsers.toLocaleString()}</p>
              </div>
              
              {/* Active Users Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <UserCheck size={20} className="text-green-600" />
                  </div>
                </div>
                <h3 className="text-sm text-gray-500 mb-1">Active Users</h3>
                <p className="text-2xl font-bold text-gray-800">{dashboardData.activeUsers.toLocaleString()}</p>
              </div>
              
              {/* Total Bookings Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Ticket size={20} className="text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-sm text-gray-500 mb-1">Total Bookings</h3>
                <p className="text-2xl font-bold text-gray-800">{dashboardData.bookingSummary.totalBookings.toLocaleString()}</p>
              </div>
              
              {/* Total Revenue Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <CreditCard size={20} className="text-red-600" />
                  </div>
                </div>
                <h3 className="text-sm text-gray-500 mb-1">Total Revenue</h3>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(dashboardData.bookingSummary.totalRevenue)}</p>
              </div>
            </div>

            {/* Popular Movies & Theaters in Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Popular Movies Preview */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Popular Movies</h3>
                  <button 
                    onClick={() => setActiveTab('movies')}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {dashboardData.bookingSummary.popularMovies.slice(0, 3).map((movie, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{movie.name}</p>
                        </div>
                      </div>
                      <div className="bg-red-50 px-3 py-1 rounded-full text-sm text-red-600">
                        {movie.count} bookings
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Popular Theaters Preview */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Popular Theaters</h3>
                  <button 
                    onClick={() => setActiveTab('theaters')}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {dashboardData.bookingSummary.popularTheatres.slice(0, 3).map((theater, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{theater.name}</p>
                        </div>
                      </div>
                      <div className="bg-red-50 px-3 py-1 rounded-full text-sm text-red-600">
                        {theater.count} bookings
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>            
          </>
        )}

        {activeTab === 'movies' && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Popular Movies</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.bookingSummary.popularMovies.map((movie, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center text-red-600 mr-4">
                      <Film size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{movie.name}</h4>
                      <p className="text-xs text-gray-500">Movie ID: {index + 1004}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="bg-red-50 px-3 py-1 rounded-full text-red-600">
                      {movie.count} bookings
                    </div>
                    <button className="text-red-600 hover:text-red-800 flex items-center">
                      <Eye size={16} className="mr-1" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'theaters' && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Popular Theaters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.bookingSummary.popularTheatres.map((theater, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center text-red-600 mr-4">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{theater.name}</h4>
                      <p className="text-xs text-gray-500">Theater ID: {index + 2001}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="bg-red-50 px-3 py-1 rounded-full text-red-600">
                      {theater.count} bookings
                    </div>
                    <button className="text-red-600 hover:text-red-800 flex items-center">
                      <Eye size={16} className="mr-1" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">All Bookings</h3>
            </div>
            
            {/* Debug info - will be removed in production */}
            
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.bookingSummary.recentBookings.map((booking, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">BK{String(index + 10011)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 mr-3">
                            {booking.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{booking.userName}</p>
                            <p className="text-xs text-gray-500">{booking.userEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* Display showTime with fallback */}
                        {booking.showTime || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* Display selectedSeats with fallback */}
                        {booking.selectedSeats && booking.selectedSeats.length > 0 
                          ? (booking.selectedSeats.length > 5 
                            ? `${booking.selectedSeats.slice(0, 3).join(', ')} +${booking.selectedSeats.length - 3} more` 
                            : booking.selectedSeats.join(', '))
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Completed</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing 1 to {dashboardData.bookingSummary.recentBookings.length} of {dashboardData.bookingSummary.recentBookings.length} entries
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500">Previous</button>
                <button className="px-3 py-1 bg-red-600 text-white rounded-md text-sm">1</button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500">Next</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;