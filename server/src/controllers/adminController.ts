import { Request, Response } from 'express';
import { User } from '../models/User';
import mongoose from 'mongoose';
import Cinema from '../models/Cinema';

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
    const users = await User.find();
    
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
  const summary: BookingSummary = {
    totalBookings: 0,
    totalRevenue: 0,
    totalSeatsBooked: 0,
    popularMovies: {},
    popularTheatres: {},
    bookingsByDate: {},
    recentBookings: []
  };

  users.forEach(user => {
    if (!user.seatsBooked || !Array.isArray(user.seatsBooked)) return;
    
    summary.totalBookings += user.seatsBooked.length;
    
    user.seatsBooked.forEach((booking: any) => {
      summary.totalRevenue += booking.totalAmount || 0;

      summary.totalSeatsBooked += booking.selectedSeats?.length || 0;
      
      const movieName = booking.movieName || 'Unknown';
      if (!summary.popularMovies[movieName]) {
        summary.popularMovies[movieName] = { count: 0, revenue: 0 };
      }
      summary.popularMovies[movieName].count += 1;
      summary.popularMovies[movieName].revenue += booking.totalAmount || 0;
      
      const theatreName = booking.theatreName || 'Unknown';
      if (!summary.popularTheatres[theatreName]) {
        summary.popularTheatres[theatreName] = { count: 0, revenue: 0 };
      }
      summary.popularTheatres[theatreName].count += 1;
      summary.popularTheatres[theatreName].revenue += booking.totalAmount || 0;
      
      const bookingDate = booking.showDate || 'Unknown';
      if (!summary.bookingsByDate[bookingDate]) {
        summary.bookingsByDate[bookingDate] = { count: 0, revenue: 0 };
      }
      summary.bookingsByDate[bookingDate].count += 1;
      summary.bookingsByDate[bookingDate].revenue += booking.totalAmount || 0;
      
      summary.recentBookings.push({
        ...booking,
        userEmail: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        showTime: booking.showTime || 'N/A',
        selectedSeats: booking.selectedSeats || [],
        showDate: booking.showDate || 'N/A'
      });
    });
  });
  
  summary.recentBookings.sort((a, b) => {
    const dateA = a.bookingDate ? new Date(a.bookingDate).getTime() : 0;
    const dateB = b.bookingDate ? new Date(b.bookingDate).getTime() : 0;
    return dateB - dateA;
  }).slice(0, 10);
  
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

const getTheaterSeats = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required'
      });
    }

    let cinemas = await Cinema.find();
    
    if (!cinemas || cinemas.length === 0) {
      console.log('No cinemas found in database, generating test data...');
      await generateTestCinemaData();
      cinemas = await Cinema.find();
    }
    
    if (!cinemas || cinemas.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const processedCinemas = cinemas.map(cinema => {
      const dateEntry = cinema.dates.find((d: any) => d.date === date);
      
      if (!dateEntry) {
        return {
          _id: cinema._id,
          name: cinema.name,
          address: cinema.address,
          distance: cinema.distance,
          location: cinema.location,
          isFull: cinema.isFull,
          isEmpty: cinema.isEmpty,
          dates: [{
            date: date as string,
            seats: [],
            showTimes: []
          }]
        };
      }
      
      return {
        _id: cinema._id,
        name: cinema.name,
        address: cinema.address,
        distance: cinema.distance,
        location: cinema.location,
        isFull: cinema.isFull,
        isEmpty: cinema.isEmpty,
        dates: [dateEntry]
      };
    });

    res.status(200).json({
      success: true,
      data: processedCinemas
    });
  } catch (error) {
    console.error('Error fetching theater seats data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch theater seats data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

const generateTestCinemaData = async () => {
  try {
    const testCinemas = [
      {
        name: "PVR Cinemas",
        address: "Select Citywalk Mall, Saket",
        distance: "5 km",
        location: "Delhi-NCR",
        isFull: false,
        isEmpty: false,
        dates: [
          {
            date: new Date().toISOString().split('T')[0], // Today
            seats: [],
            showTimes: [
              {
                time: "18:00",
                bookedSeats: ["A1", "A2", "B5", "C7", "D4", "E10", "F2", "G8"],
                movieName: "Inception"
              },
              {
                time: "21:30",
                bookedSeats: ["B3", "B4", "C1", "C2", "D5", "D6", "E7", "E8", "F1"],
                movieName: "Interstellar"
              }
            ]
          },
          {
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
            seats: [],
            showTimes: [
              {
                time: "14:30",
                bookedSeats: ["A5", "B6", "C3"],
                movieName: "Inception"
              },
              {
                time: "18:00",
                bookedSeats: ["D2", "E3", "F4"],
                movieName: "Interstellar"
              }
            ]
          }
        ]
      },
      {
        name: "INOX",
        address: "R-City Mall, Ghatkopar",
        distance: "3 km",
        location: "Mumbai",
        isFull: false,
        isEmpty: false,
        dates: [
          {
            date: new Date().toISOString().split('T')[0], // Today
            seats: [],
            showTimes: [
              {
                time: "15:00",
                bookedSeats: ["A3", "A4", "B1", "B2", "C8", "D9", "E5", "F7", "G2", "G3"],
                movieName: "Dune"
              },
              {
                time: "19:15",
                bookedSeats: ["B7", "B8", "C4", "C5", "D1", "D2", "E9", "F10"],
                movieName: "No Time To Die"
              }
            ]
          }
        ]
      },
      {
        name: "Cinepolis",
        address: "Orion Mall, Malleshwaram",
        distance: "8 km",
        location: "Bangalore",
        isFull: false,
        isEmpty: false,
        dates: [
          {
            date: new Date().toISOString().split('T')[0], // Today
            seats: [],
            showTimes: [
              {
                time: "14:30",
                bookedSeats: ["A6", "A7", "B9", "B10", "C3", "C4", "D8", "E2", "F5", "G1"],
                movieName: "Black Widow"
              },
              {
                time: "20:00",
                bookedSeats: Array.from({ length: 190 }, (_, i) => {
                  const row = String.fromCharCode(65 + Math.floor(i / 20)); // A-J rows
                  const seat = (i % 20) + 1; // 1-20 seats per row
                  return `${row}${seat}`;
                }),
                movieName: "Shang-Chi"
              }
            ]
          }
        ]
      }
    ];

    for (const cinema of testCinemas) {
      await Cinema.create(cinema);
    }
    
    console.log('Test cinema data generated successfully');
  } catch (error) {
    console.error('Error generating test cinema data:', error);
  }
};

export { dashboard, getTheaterSeats };
