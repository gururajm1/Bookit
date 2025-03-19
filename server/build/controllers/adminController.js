"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTheaterSeats = exports.dashboard = void 0;
const User_1 = require("../models/User"); // Import the User model
const Cinema_1 = __importDefault(require("../models/Cinema")); // Import the Cinema model
const dashboard = async (req, res) => {
    try {
        // Fetch all users
        const users = await User_1.User.find();
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
    }
    catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.dashboard = dashboard;
const calculateBookingSummary = (users) => {
    // Initialize summary object
    const summary = {
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
        if (!user.seatsBooked || !Array.isArray(user.seatsBooked))
            return;
        // Update total bookings count
        summary.totalBookings += user.seatsBooked.length;
        // Process each booking
        user.seatsBooked.forEach((booking) => {
            var _a;
            // Add to total revenue
            summary.totalRevenue += booking.totalAmount || 0;
            // Add to total seats booked
            summary.totalSeatsBooked += ((_a = booking.selectedSeats) === null || _a === void 0 ? void 0 : _a.length) || 0;
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
            summary.recentBookings.push(Object.assign(Object.assign({}, booking), { userEmail: user.email, userName: `${user.firstName} ${user.lastName}`, showTime: booking.showTime || 'N/A', selectedSeats: booking.selectedSeats || [], showDate: booking.showDate || 'N/A' }));
        });
    });
    // Sort recent bookings by date (newest first) and limit to 10
    summary.recentBookings.sort((a, b) => {
        const dateA = a.bookingDate ? new Date(a.bookingDate).getTime() : 0;
        const dateB = b.bookingDate ? new Date(b.bookingDate).getTime() : 0;
        return dateB - dateA;
    }).slice(0, 10);
    // Convert objects to arrays for easier consumption by frontend
    return Object.assign(Object.assign({}, summary), { popularMovies: Object.entries(summary.popularMovies)
            .map(([name, data]) => (Object.assign({ name }, data)))
            .sort((a, b) => b.count - a.count), popularTheatres: Object.entries(summary.popularTheatres)
            .map(([name, data]) => (Object.assign({ name }, data)))
            .sort((a, b) => b.count - a.count), bookingsByDate: Object.entries(summary.bookingsByDate)
            .map(([date, data]) => (Object.assign({ date }, data)))
            .sort((a, b) => a.date.localeCompare(b.date)) });
};
// New function to get theater seat data for admin dashboard
const getTheaterSeats = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date parameter is required'
            });
        }
        // Fetch all cinemas
        let cinemas = await Cinema_1.default.find();
        // If no cinemas exist, create test data
        if (!cinemas || cinemas.length === 0) {
            console.log('No cinemas found in database, generating test data...');
            await generateTestCinemaData();
            cinemas = await Cinema_1.default.find();
        }
        if (!cinemas || cinemas.length === 0) {
            return res.status(200).json({
                success: true,
                data: [] // Return empty array if still no cinemas found
            });
        }
        // Process cinemas to include only relevant date information
        const processedCinemas = cinemas.map(cinema => {
            // Find the date entry that matches the requested date
            const dateEntry = cinema.dates.find((d) => d.date === date);
            // If this cinema has no data for the requested date, return basic cinema info
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
                            date: date,
                            seats: [],
                            showTimes: []
                        }]
                };
            }
            // Return cinema with only the relevant date
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
    }
    catch (error) {
        console.error('Error fetching theater seats data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch theater seats data',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.getTheaterSeats = getTheaterSeats;
// Helper function to generate test cinema data
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
        // Save test data to database
        for (const cinema of testCinemas) {
            await Cinema_1.default.create(cinema);
        }
        console.log('Test cinema data generated successfully');
    }
    catch (error) {
        console.error('Error generating test cinema data:', error);
    }
};
