"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const router = express_1.default.Router();
// Get user's booked tickets
router.get('/booked-tickets', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        const user = await User_1.User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        return res.status(200).json({
            success: true,
            tickets: user.seatsBooked || []
        });
    }
    catch (error) {
        console.error('Error fetching booked tickets:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
// Add a new booking to user's profile
router.post('/add-booking', async (req, res) => {
    try {
        const { email, booking } = req.body;
        if (!email || !booking) {
            return res.status(400).json({
                success: false,
                message: 'Email and booking details are required'
            });
        }
        const user = await User_1.User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Add the new booking to the seatsBooked array
        user.seatsBooked = user.seatsBooked || [];
        user.seatsBooked.push(Object.assign(Object.assign({}, booking), { bookingDate: new Date() }));
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'Booking added successfully',
            tickets: user.seatsBooked
        });
    }
    catch (error) {
        console.error('Error adding booking:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
