"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cinemaController_1 = require("../controllers/cinemaController");
const router = express_1.default.Router();
router.post('/seats', cinemaController_1.updateOrCreateCinemaSeats);
router.get('/verify/:name', cinemaController_1.verifyCinemaName);
router.get('/booked-seats', cinemaController_1.getBookedSeats);
router.get('/seats-count', cinemaController_1.getBookedSeatsCount);
exports.default = router;
