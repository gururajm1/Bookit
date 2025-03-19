"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCinemaName = exports.updateOrCreateCinemaSeats = void 0;
const Cinema_1 = __importDefault(require("../models/Cinema"));
const updateOrCreateCinemaSeats = async (req, res) => {
    try {
        const { name, address, location, selectedSeats, showDate } = req.body;
        // Try to find existing cinema by name
        let cinema = await Cinema_1.default.findOne({ name });
        if (cinema) {
            // Cinema exists, check for date
            const existingDateIndex = cinema.dates.findIndex(d => d.date === showDate);
            if (existingDateIndex !== -1) {
                // Date exists, update seats
                cinema.dates[existingDateIndex].seats = [
                    ...new Set([...cinema.dates[existingDateIndex].seats, ...selectedSeats])
                ];
            }
            else {
                // Date doesn't exist, add new date entry
                cinema.dates.push({
                    date: showDate,
                    seats: selectedSeats
                });
            }
            await cinema.save();
        }
        else {
            // Create new cinema with seats
            cinema = await Cinema_1.default.create({
                name,
                address,
                location,
                distance: '0 km', // Default value
                showTimes: 'Multiple', // Default value
                isFull: false,
                isEmpty: false,
                dates: [{
                        date: showDate,
                        seats: selectedSeats
                    }]
            });
        }
        res.status(200).json({
            success: true,
            data: cinema
        });
    }
    catch (error) {
        console.error('Error in updateOrCreateCinemaSeats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.updateOrCreateCinemaSeats = updateOrCreateCinemaSeats;
const verifyCinemaName = async (req, res) => {
    try {
        const { name } = req.params;
        const cinema = await Cinema_1.default.findOne({ name });
        res.status(200).json({
            success: true,
            exists: !!cinema,
            data: cinema
        });
    }
    catch (error) {
        console.error('Error in verifyCinemaName:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.verifyCinemaName = verifyCinemaName;
