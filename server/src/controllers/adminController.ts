import { Request, Response } from 'express';
import { User } from '../models/User'; // Import the User model
import mongoose from 'mongoose';

interface BookingSummary {
  totalBookings: number;
  totalRevenue: number;
  totalSeatsBooked: number;
  popularMovies: { [key: string]: { count: number, revenue: number } };
  popularTheatres: { [key: string]: { count: number, revenue: number } };
  bookingsByDate: { [key: string]: { count: number, revenue: number } };
  recentBookings: any[];
}

const dashboard = async (req: Request, res: Response) => {
  try {
    // Fetch all users
    const users = await User.find();
    
    // Initialize dashboard metrics
    const dashboardData = {
      totalUsers: users.length,
      activeUsers: users.filter(user => user.isActive).length,
      adminUsers: users.filter(user => user.isAdmin).length,
      bookingSummary: calculateBookingSummary(users),
    };

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch dashboard data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

const calculateBookingSummary = (users: any[]): BookingSummary => {
  // Initialize summary object
  const summary: BookingSummary = {
    totalBookings: 0,
    totalRevenue: 0,
    totalSeatsBooked: 0,
    popularMovies: {},
    popularTheatres: {},
    bookingsByDate: {},
    recentBookings: []
  };

  // Process all users' booking data
  users.forEach(user => {
    if (!user.seatsBooked || !Array.isArray(user.seatsBooked)) return;
    
    // Update total bookings count
    summary.totalBookings += user.seatsBooked.length;
    
    // Process each booking
    user.seatsBooked.forEach((booking: any) => {
      // Add to total revenue
      summary.totalRevenue += booking.totalAmount || 0;
      
      // Add to total seats booked
      summary.totalSeatsBooked += booking.selectedSeats?.length || 0;
      
      // Track popular movies
      const movieName = booking.movieName || 'Unknown';
      if (!summary.popularMovies[movieName]) {
        summary.popularMovies[movieName] = { count: 0, revenue: 0 };
      }
      summary.popularMovies[movieName].count += 1;
      summary.popularMovies[movieName].revenue += booking.totalAmount || 0;
      
      // Track popular theatres
      const theatreName = booking.theatreName || 'Unknown';
      if (!summary.popularTheatres[theatreName]) {
        summary.popularTheatres[theatreName] = { count: 0, revenue: 0 };
      }
      summary.popularTheatres[theatreName].count += 1;
      summary.popularTheatres[theatreName].revenue += booking.totalAmount || 0;
      
      // Track bookings by date (show date)
      const bookingDate = booking.showDate || 'Unknown';
      if (!summary.bookingsByDate[bookingDate]) {
        summary.bookingsByDate[bookingDate] = { count: 0, revenue: 0 };
      }
      summary.bookingsByDate[bookingDate].count += 1;
      summary.bookingsByDate[bookingDate].revenue += booking.totalAmount || 0;
      
      // Add to recent bookings (with user info)
      summary.recentBookings.push({
        ...booking,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`
      });
    });
  });
  
  // Sort recent bookings by date (newest first) and limit to 10
  summary.recentBookings.sort((a, b) => {
    const dateA = a.bookingDate ? new Date(a.bookingDate).getTime() : 0;
    const dateB = b.bookingDate ? new Date(b.bookingDate).getTime() : 0;
    return dateB - dateA;
  }).slice(0, 10);
  
  // Convert objects to arrays for easier consumption by frontend
  return {
    ...summary,
    popularMovies: Object.entries(summary.popularMovies)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count),
    popularTheatres: Object.entries(summary.popularTheatres)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count),
    bookingsByDate: Object.entries(summary.bookingsByDate)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date))
  } as any;
};

export { dashboard };
