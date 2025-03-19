import React, { useState, useEffect } from 'react';
import adminService, { DashboardData } from '../services/adminService';

// Dashboard component
const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium text-lg animate-pulse">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-50 to-pink-50">
        <div className="bg-white border-l-4 border-red-500 rounded-lg p-8 max-w-md shadow-lg transform hover:scale-105 transition-all duration-300">
          <h2 className="text-red-600 text-2xl font-bold mb-3">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-md hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-md transform hover:-translate-y-1"
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get booking trend data
  const trendDates = dashboardData.bookingSummary.bookingsByDate.map(item => item.date);
  const trendValues = dashboardData.bookingSummary.bookingsByDate.map(item => item.count);

  // Calculate max value for trend chart
  const maxTrendValue = Math.max(...trendValues, 1);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
      
      {/* User Statistics Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">User Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Users Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.totalUsers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Active Users Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.activeUsers}</p>
                <p className="text-sm text-green-600">{Math.round((dashboardData.activeUsers / (dashboardData.totalUsers || 1)) * 100)}% of total</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Admin Users Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Admin Users</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.adminUsers}</p>
                <p className="text-sm text-purple-600">{Math.round((dashboardData.adminUsers / (dashboardData.totalUsers || 1)) * 100)}% of total</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Summary Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Booking Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Bookings Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.bookingSummary.totalBookings}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Total Revenue Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-800">{formatCurrency(dashboardData.bookingSummary.totalRevenue)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Total Seats Booked Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Seats Booked</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.bookingSummary.totalSeatsBooked}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Trends Chart */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Booking Trends</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="h-64">
            <div className="flex h-full items-end">
              {dashboardData.bookingSummary.bookingsByDate.map((item) => {
                const value = item.count;
                const height = `${(value / Math.max(...dashboardData.bookingSummary.bookingsByDate.map(item => item.count), 1)) * 100}%`;
                
                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center mx-1">
                    <div 
                      className="w-full bg-blue-500 rounded-t-md transition-all duration-500 ease-in-out hover:bg-blue-600"
                      style={{ height }}
                      title={`${value} bookings on ${item.date}`}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                      {formatDate(item.date)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Popular Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Popular Movies */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Popular Movies</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Movie
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.bookingSummary.popularMovies.map((movie, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{movie.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{movie.count}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Popular Theaters */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Popular Theaters</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Theater
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.bookingSummary.popularTheatres.map((theater, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{theater.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{theater.count}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Recent Bookings */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Bookings</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Movie
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Theater
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.bookingSummary.recentBookings.map((booking, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                      <div className="text-sm text-gray-500">{booking.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.movieName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.theatreName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(booking.showDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(booking.totalAmount)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;