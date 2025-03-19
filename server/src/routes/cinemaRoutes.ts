import express from 'express';
import { updateOrCreateCinemaSeats, verifyCinemaName, getBookedSeats } from '../controllers/cinemaController';

const router = express.Router();

router.post('/seats', updateOrCreateCinemaSeats);
router.get('/verify/:name', verifyCinemaName);
router.get('/booked-seats', getBookedSeats);

export default router;
