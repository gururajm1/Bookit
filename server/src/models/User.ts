import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

interface BookedTicket {
  movieName: string;
  movieCertification: string;
  genres: string;
  language: string;
  theatreName: string;
  theatreLocation: string;
  showDate: string;
  showTime: string;
  totalAmount: number;
  selectedSeats: string[];
  bookingDate: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  lastLogin?: Date;
  isAdmin: boolean;
  seatsBooked: BookedTicket[];
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  seatsBooked: [{
    movieName: String,
    movieCertification: String,
    genres: String,
    language: String,
    theatreName: String,
    theatreLocation: String,
    showDate: String,
    showTime: String,
    totalAmount: Number,
    selectedSeats: [String],
    bookingDate: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
