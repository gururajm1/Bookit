import { Request, Response } from 'express';
import Cinema, { ICinema } from '../models/Cinema';

export const getBookedSeats = async (req: Request, res: Response) => {
  try {
    console.log('Received request query:', req.query); // Debug log

    const { theatreName, date, showTime } = req.query;

    if (!theatreName || !date || !showTime) {
      console.error('Missing required fields:', { theatreName, date, showTime });
      return res.status(400).json({
        success: false,
        message: 'Theatre name, date, and show time are required',
        receivedData: req.query
      });
    }

    const cinema = await Cinema.findOne({ name: theatreName });
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

    const showTimeEntry = dateEntry.showTimes?.find(st => st.time === showTime);
    console.log('Found showTime entry:', showTimeEntry); // Debug log

    console.log('Returning booked seats:', showTimeEntry?.bookedSeats || []); // Debug log
    return res.status(200).json({
      success: true,
      bookedSeats: showTimeEntry?.bookedSeats || []
    });
  } catch (error) {
    console.error('Error in getBookedSeats:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
      error: error instanceof Error ? error.stack : undefined
    });
  }
};

export const updateOrCreateCinemaSeats = async (req: Request, res: Response) => {
  try {
    console.log('Received request body:', req.body); // Debug log

    const { name, address, location, selectedSeats, showDate, showTime, paymentId } = req.body;

    if (!name || !address || !location || !selectedSeats || !showDate || !showTime) {
      console.error('Missing required fields:', { name, address, location, selectedSeats, showDate, showTime });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        receivedData: req.body
      });
    }

    // Try to find existing cinema by name
    let cinema = await Cinema.findOne({ name });
    console.log('Found existing cinema:', cinema); // Debug log

    if (cinema) {
      // Cinema exists, check for date
      const dateIndex = cinema.dates.findIndex(d => d.date === showDate);
      console.log('Existing date index:', dateIndex); // Debug log
      
      if (dateIndex !== -1) {
        // Date exists, check for showTime
        const showTimeIndex = cinema.dates[dateIndex].showTimes?.findIndex(st => st.time === showTime) ?? -1;
        
        if (showTimeIndex !== -1) {
          // ShowTime exists, update bookedSeats
          cinema.dates[dateIndex].showTimes![showTimeIndex].bookedSeats = [
            ...new Set([...cinema.dates[dateIndex].showTimes![showTimeIndex].bookedSeats, ...selectedSeats])
          ];
        } else {
          // ShowTime doesn't exist, add new showTime
          if (!cinema.dates[dateIndex].showTimes) {
            cinema.dates[dateIndex].showTimes = [];
          }
          cinema.dates[dateIndex].showTimes.push({
            time: showTime,
            bookedSeats: selectedSeats
          });
        }
      } else {
        // Date doesn't exist, add new date with showTime
        cinema.dates.push({
          date: showDate,
          seats: [],
          showTimes: [{
            time: showTime,
            bookedSeats: selectedSeats
          }]
        });
      }

      await cinema.save();
      console.log('Updated cinema:', cinema); // Debug log
    } else {
      // Create new cinema with seats
      cinema = await Cinema.create({
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
            bookedSeats: selectedSeats
          }]
        }]
      });
      console.log('Created new cinema:', cinema); // Debug log
    }

    res.status(200).json({
      success: true,
      data: cinema
    });
  } catch (error) {
    console.error('Error in updateOrCreateCinemaSeats:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
      error: error instanceof Error ? error.stack : undefined
    });
  }
};

export const verifyCinemaName = async (req: Request, res: Response) => {
  try {
    console.log('Received request params:', req.params); // Debug log

    const { name } = req.params;
    const cinema = await Cinema.findOne({ name });

    console.log('Found cinema:', cinema); // Debug log

    res.status(200).json({
      success: true,
      exists: !!cinema,
      data: cinema
    });
  } catch (error) {
    console.error('Error in verifyCinemaName:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
      error: error instanceof Error ? error.stack : undefined
    });
  }
};
