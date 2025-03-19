"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookedSeatsCount = exports.verifyCinemaName = exports.updateOrCreateCinemaSeats = exports.getBookedSeats = void 0;
const Cinema_1 = __importDefault(require("../models/Cinema"));
const getBookedSeats = async (req, res) => {
    var _a;
    try {
        console.log('Received request query:', req.query); // Debug log
        const { theatreName, date, showTime, movieName } = req.query;
        if (!theatreName || !date || !showTime || !movieName) {
            console.error('Missing required fields:', { theatreName, date, showTime, movieName });
            return res.status(400).json({
                success: false,
                message: 'Theatre name, date, show time, and movie name are required',
                receivedData: req.query
            });
        }
        const cinema = await Cinema_1.default.findOne({ name: theatreName });
        console.log('Found existing cinema:', cinema); // Debug log
        if (!cinema) {
            console.log('Cinema not found:', theatreName); // Debug log
            return res.status(200).json({
                success: true,
                bookedSeats: []
            });
        }
        const dateEntry = cinema.dates.find(d => d.date === date);
        console.log('Found date entry:', dateEntry); // Debug log
        if (!dateEntry) {
            console.log('Date entry not found:', date); // Debug log
            return res.status(200).json({
                success: true,
                bookedSeats: []
            });
        }
        const showTimeEntry = (_a = dateEntry.showTimes) === null || _a === void 0 ? void 0 : _a.find(st => st.time === showTime && st.movieName === movieName);
        console.log('Found showTime entry:', showTimeEntry); // Debug log
        console.log('Returning booked seats:', (showTimeEntry === null || showTimeEntry === void 0 ? void 0 : showTimeEntry.bookedSeats) || []); // Debug log
        return res.status(200).json({
            success: true,
            bookedSeats: (showTimeEntry === null || showTimeEntry === void 0 ? void 0 : showTimeEntry.bookedSeats) || []
        });
    }
    catch (error) {
        console.error('Error in getBookedSeats:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Internal server error',
            error: error instanceof Error ? error.stack : undefined
        });
    }
};
exports.getBookedSeats = getBookedSeats;
const updateOrCreateCinemaSeats = async (req, res) => {
    var _a, _b;
    try {
        console.log('Received request body:', req.body);
        const { name, address, location, selectedSeats, showDate, showTime, movieName, paymentId } = req.body;
        if (!name || !address || !location || !selectedSeats || !showDate || !showTime || !movieName) {
            console.error('Missing required fields:', { name, address, location, selectedSeats, showDate, showTime, movieName });
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                receivedData: req.body
            });
        }
        // Try to find existing cinema by name
        let cinema = await Cinema_1.default.findOne({ name });
        console.log('Found existing cinema:', cinema);
        if (cinema) {
            // Cinema exists, check for date
            const dateIndex = cinema.dates.findIndex(d => d.date === showDate);
            console.log('Existing date index:', dateIndex);
            if (dateIndex !== -1) {
                // Date exists, check for showTime
                const showTimeIndex = (_b = (_a = cinema.dates[dateIndex].showTimes) === null || _a === void 0 ? void 0 : _a.findIndex(st => st.time === showTime && st.movieName === movieName)) !== null && _b !== void 0 ? _b : -1;
                if (showTimeIndex !== -1) {
                    // ShowTime exists, update bookedSeats
                    cinema.dates[dateIndex].showTimes[showTimeIndex].bookedSeats = [
                        ...new Set([...cinema.dates[dateIndex].showTimes[showTimeIndex].bookedSeats, ...selectedSeats])
                    ];
                }
                else {
                    // ShowTime doesn't exist, add new showTime
                    if (!cinema.dates[dateIndex].showTimes) {
                        cinema.dates[dateIndex].showTimes = [];
                    }
                    cinema.dates[dateIndex].showTimes.push({
                        time: showTime,
                        bookedSeats: selectedSeats,
                        movieName
                    });
                }
            }
            else {
                // Date doesn't exist, add new date with showTime
                cinema.dates.push({
                    date: showDate,
                    seats: [],
                    showTimes: [{
                            time: showTime,
                            bookedSeats: selectedSeats,
                            movieName
                        }]
                });
            }
            await cinema.save();
            console.log('Updated cinema:', cinema);
        }
        else {
            // Create new cinema with seats
            cinema = await Cinema_1.default.create({
                name,
                address,
                location,
                distance: '0 km',
                isFull: false,
                isEmpty: false,
                dates: [{
                        date: showDate,
                        seats: [],
                        showTimes: [{
                                time: showTime,
                                bookedSeats: selectedSeats,
                                movieName
                            }]
                    }]
            });
            console.log('Created new cinema:', cinema);
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
            message: error instanceof Error ? error.message : 'Internal server error',
            error: error instanceof Error ? error.stack : undefined
        });
    }
};
exports.updateOrCreateCinemaSeats = updateOrCreateCinemaSeats;
const verifyCinemaName = async (req, res) => {
    try {
        console.log('Received request params:', req.params); // Debug log
        const { name } = req.params;
        const cinema = await Cinema_1.default.findOne({ name });
        console.log('Found cinema:', cinema); // Debug log
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
            message: error instanceof Error ? error.message : 'Internal server error',
            error: error instanceof Error ? error.stack : undefined
        });
    }
};
exports.verifyCinemaName = verifyCinemaName;
const getBookedSeatsCount = async (req, res) => {
    var _a;
    try {
        console.log('Received request query:', req.query);
        const { theatreName, date, showTime, movieName } = req.query;
        if (!theatreName || !date || !showTime || !movieName) {
            console.error('Missing required fields:', { theatreName, date, showTime, movieName });
            return res.status(400).json({
                success: false,
                message: 'Theatre name, date, show time, and movie name are required',
                receivedData: req.query
            });
        }
        const cinema = await Cinema_1.default.findOne({ name: theatreName });
        console.log('Found cinema:', cinema);
        if (!cinema) {
            return res.status(200).json({
                success: true,
                count: 0
            });
        }
        const dateEntry = cinema.dates.find(d => d.date === date);
        if (!(dateEntry === null || dateEntry === void 0 ? void 0 : dateEntry.showTimes)) {
            return res.status(200).json({
                success: true,
                count: 0
            });
        }
        const showTimeEntry = dateEntry.showTimes.find(st => st.time === showTime && st.movieName === movieName);
        return res.status(200).json({
            success: true,
            count: ((_a = showTimeEntry === null || showTimeEntry === void 0 ? void 0 : showTimeEntry.bookedSeats) === null || _a === void 0 ? void 0 : _a.length) || 0
        });
    }
    catch (error) {
        console.error('Error in getBookedSeatsCount:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Internal server error',
            error: error instanceof Error ? error.stack : undefined
        });
    }
};
exports.getBookedSeatsCount = getBookedSeatsCount;
