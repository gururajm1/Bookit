import mongoose, { Document, Schema } from 'mongoose';

interface ISeatAvailability {
  date: string;
  seats: string[];
  showTimes?: Array<{
    time: string;
    bookedSeats: string[];
  }>;
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
        },
      ],
    },
  ],
});

export default mongoose.model<ICinema>('Cinema', CinemaSchema);
