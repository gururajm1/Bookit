"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
// Import middleware for authentication if needed
// import { authenticateToken, isAdmin } from '../middleware/authMiddleware';
const router = express_1.default.Router();
// Dashboard route - you might want to add authentication middleware
router.get('/dashboard', adminController_1.dashboard);
// Theater seats route for admin dashboard
router.get('/theater-seats', adminController_1.getTheaterSeats);
// Add more admin routes as needed
// router.get('/users', authenticateToken, isAdmin, getAllUsers);
// router.get('/bookings', authenticateToken, isAdmin, getAllBookings);
exports.default = router;
