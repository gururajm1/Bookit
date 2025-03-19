import axios from 'axios';

const API_URL = 'http://localhost:1002/bookit/admin';

export interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  bookingSummary: {
    totalBookings: number;
    totalRevenue: number;
    totalSeatsBooked: number;
    popularMovies: Array<{
      name: string;
      count: number;
      revenue: number;
    }>;
    popularTheatres: Array<{
      name: string;
      count: number;
      revenue: number;
    }>;
    recentBookings: Array<{
      userEmail: string;
      userName: string;
      movieName: string;
      theatreName: string;
      showDate: string;
      showTime: string;
      totalAmount: number;
      selectedSeats: string[];
      bookingDate: string;
    }>;
    bookingsByDate: Array<{
      date: string;
      count: number;
      revenue: number;
    }>;
  };
}

class AdminService {
  async getDashboardData(): Promise<DashboardData> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await axios.get(`${API_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data.data;
  }
}

const adminService = new AdminService();
export default adminService;
