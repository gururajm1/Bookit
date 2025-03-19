import mongoose, { Document, Schema } from 'mongoose';

interface IShowTime {
  time: string;
  bookedSeats: string[];
  movieName: string;
}

interface ISeatAvailability {
  date: string;
  seats: string[];
  showTimes?: IShowTime[];
}

export interface ICinema extends Document {
  name: string;
  address: string;
  distance: string;
  location: string;
  isFull: boolean;
  isEmpty: boolean;
  dates: ISeatAvailability[];
}

const CinemaSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  distance: { type: String, required: true },
  location: { type: String, required: true },
  isFull: { type: Boolean, default: false },
  isEmpty: { type: Boolean, default: false },
  dates: [
    {
      date: { type: String, required: true },
      seats: { type: [String], required: true },
      showTimes: [
        {
          time: { type: String },
          bookedSeats: { type: [String] },
          movieName: { type: String, required: true }
        },
      ],
    },
  ],
});

CinemaSchema.index({ name: 1 });
CinemaSchema.index({ location: 1 });
CinemaSchema.index({ 'dates.date': 1 });
CinemaSchema.index({ 'dates.showTimes.movieName': 1 });

export default mongoose.model<ICinema>('Cinema', CinemaSchema);
