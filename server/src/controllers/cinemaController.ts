import { Request, Response } from 'express';
import Cinema, { ICinema } from '../models/Cinema';

export const getBookedSeats = async (req: Request, res: Response) => {
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

    const cinema = await Cinema.findOne({ name: theatreName });
    console.log('Found existing cinema:', cinema); 
    
    if (!cinema) {
      console.log('Cinema not found:', theatreName);
      return res.status(200).json({
        success: true,
        bookedSeats: []
      });
    }

    const dateEntry = cinema.dates.find(d => d.date === date);
    console.log('Found date entry:', dateEntry);
    if (!dateEntry) {
      console.log('Date entry not found:', date);
      return res.status(200).json({
        success: true,
        bookedSeats: []
      });
    }

    const showTimeEntry = dateEntry.showTimes?.find(st => st.time === showTime && st.movieName === movieName);
    console.log('Found showTime entry:', showTimeEntry);

    console.log('Returning booked seats:', showTimeEntry?.bookedSeats || []);
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

    let cinema = await Cinema.findOne({ name });
    console.log('Found existing cinema:', cinema);

    if (cinema) {
      const dateIndex = cinema.dates.findIndex(d => d.date === showDate);
      console.log('Existing date index:', dateIndex);

      if (dateIndex !== -1) {
        const showTimeIndex = cinema.dates[dateIndex].showTimes?.findIndex(st => st.time === showTime && st.movieName === movieName) ?? -1;
        
        if (showTimeIndex !== -1) {
          cinema.dates[dateIndex].showTimes![showTimeIndex].bookedSeats = [
            ...new Set([...cinema.dates[dateIndex].showTimes![showTimeIndex].bookedSeats, ...selectedSeats])
          ];
        } else {
          if (!cinema.dates[dateIndex].showTimes) {
            cinema.dates[dateIndex].showTimes = [];
          }
          cinema.dates[dateIndex].showTimes.push({
            time: showTime,
            bookedSeats: selectedSeats,
            movieName
          });
        }
      } else {
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
    } else {
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
    console.log('Received request params:', req.params);

    const { name } = req.params;
    const cinema = await Cinema.findOne({ name });

    console.log('Found cinema:', cinema);

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

export const getBookedSeatsCount = async (req: Request, res: Response) => {
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

    const cinema = await Cinema.findOne({ name: theatreName });
    console.log('Found cinema:', cinema);

    if (!cinema) {
      return res.status(200).json({
        success: true,
        count: 0
      });
    }

    const dateEntry = cinema.dates.find(d => d.date === date);
    if (!dateEntry?.showTimes) {
      return res.status(200).json({
        success: true,
        count: 0
      });
    }

    const showTimeEntry = dateEntry.showTimes.find(
      st => st.time === showTime && st.movieName === movieName
    );

    return res.status(200).json({
      success: true,
      count: showTimeEntry?.bookedSeats?.length || 0
    });
  } catch (error) {
    console.error('Error in getBookedSeatsCount:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
      error: error instanceof Error ? error.stack : undefined
    });
  }
};
