import express from 'express';
import { dashboard, getTheaterSeats } from '../controllers/adminController';
// Import middleware for authentication if needed
// import { authenticateToken, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Dashboard route - you might want to add authentication middleware
router.get('/dashboard', dashboard);

// Theater seats route for admin dashboard
router.get('/theater-seats', getTheaterSeats);

// Add more admin routes as needed
// router.get('/users', authenticateToken, isAdmin, getAllUsers);
// router.get('/bookings', authenticateToken, isAdmin, getAllBookings);

export default router;
