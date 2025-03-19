import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Film, 
  MapPin, 
  Ticket, 
  Users, 
  Plus, 
  DollarSign, 
  Calendar,
  Clock
} from 'lucide-react';

interface DashboardStats {
  totalMovies: number;
  totalLocations: number;
  totalBookings: number;
  totalUsers: number;
  totalRevenue: number;
  todayBookings: number;
  todayRevenue: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalMovies: 0,
    totalLocations: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    todayBookings: 0,
    todayRevenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5001/bookit/admin/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: 'Add Movie',
      icon: <Film className="w-6 h-6" />,
      path: '/admin/movies/add',
      color: 'bg-blue-500'
    },
    {
      title: 'Add Location',
      icon: <MapPin className="w-6 h-6" />,
      path: '/admin/locations/add',
      color: 'bg-green-500'
    },
    {
      title: 'View Bookings',
      icon: <Ticket className="w-6 h-6" />,
      path: '/admin/bookings',
      color: 'bg-purple-500'
    },
    {
      title: 'Manage Users',
      icon: <Users className="w-6 h-6" />,
      path: '/admin/users',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Movies</p>
              <h3 className="text-2xl font-bold">{stats.totalMovies}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Film className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Locations</p>
              <h3 className="text-2xl font-bold">{stats.totalLocations}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <MapPin className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Today's Bookings</p>
              <h3 className="text-2xl font-bold">{stats.todayBookings}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Today's Revenue</p>
              <h3 className="text-2xl font-bold">₹{stats.todayRevenue}</h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`${action.color} p-3 rounded-full text-white`}>
                {action.icon}
              </div>
              <span className="font-medium">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {/* Add recent activity items here */}
          <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
            <div className="bg-blue-100 p-2 rounded-full">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="font-medium">New booking for Avengers</p>
              <p className="text-sm text-gray-500">2 minutes ago</p>
            </div>
          </div>
          {/* Add more activity items */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 