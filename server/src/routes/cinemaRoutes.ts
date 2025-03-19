import express from 'express';
import { getBookedSeats, updateOrCreateCinemaSeats, verifyCinemaName, getBookedSeatsCount } from '../controllers/cinemaController';

const router = express.Router();

router.post('/seats', updateOrCreateCinemaSeats);
router.get('/verify/:name', verifyCinemaName);
router.get('/booked-seats', getBookedSeats);
router.get('/seats-count', getBookedSeatsCount);

export default router;
