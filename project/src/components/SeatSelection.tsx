import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronLeft } from 'lucide-react';
import { 
  selectMovie,
  selectCinema,
  selectShowTime,
  selectSeats,
  addSelectedSeat,
  removeSelectedSeat,
  clearSelectedSeats
} from '../redux/slices/movieSlice';
import { format } from 'date-fns';

interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'selected' | 'booked';
}

const SeatSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const selectedMovie = useSelector(selectMovie);
  const selectedCinema = useSelector(selectCinema);
  const selectedShowTime = useSelector(selectShowTime);
  const selectedSeats = useSelector(selectSeats);
  
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (!selectedMovie || !selectedCinema || !selectedShowTime) {
      navigate('/dash');
    }
  }, [selectedMovie, selectedCinema, selectedShowTime, navigate]);

  useEffect(() => {
    // Calculate total amount whenever selected seats change
    setTotalAmount(selectedSeats.length * (selectedCinema?.price || 0));
  }, [selectedSeats, selectedCinema]);

  // Generate seats layout
  const generateSeats = (row: string, count: number): Seat[] => {
    return Array.from({ length: count }, (_, i) => {
      const seatNumber = i + 1;
      return {
        id: `${row}${seatNumber}`,
        row,
        number: seatNumber,
        status: selectedCinema?.seatsBooked.includes(seatNumber) ? 'booked' : 'available'
      };
    });
  };

  const rows = {
    classic: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    prime: ['J', 'K', 'L', 'M']
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;

    const seatNumber = parseInt(seat.id.replace(/[A-Z]/g, ''));
    
    if (selectedSeats.includes(seatNumber)) {
      dispatch(removeSelectedSeat(seatNumber));
    } else {
      dispatch(addSelectedSeat(seatNumber));
    }
  };

  if (!selectedMovie || !selectedCinema || !selectedShowTime) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button className="hover:text-red-500" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold">SELECT SEATS</span>
                <span>›</span>
                <span className="text-gray-400">PAYMENT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Seats Layout */}
          <div className="flex-1">
            {/* Screen */}
            <div className="text-center mb-12">
              <div className="w-3/4 h-8 mx-auto bg-gray-200 rounded-t-full"></div>
              <p className="mt-2 text-sm text-gray-500">SCREEN</p>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border border-gray-300 rounded"></div>
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded"></div>
                <span className="text-sm">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <span className="text-sm">Booked</span>
              </div>
            </div>

            {/* Seats */}
            <div className="space-y-12">
              {/* Classic Seats */}
              <div>
                <h3 className="text-center mb-4">CLASSIC (₹{selectedCinema.price})</h3>
                <div className="grid gap-2">
                  {rows.classic.map(row => (
                    <div key={row} className="flex items-center gap-2">
                      <span className="w-6 text-right">{row}</span>
                      <div className="flex gap-1 flex-1 justify-center">
                        {generateSeats(row, 25).map(seat => {
                          const seatNumber = parseInt(seat.id.replace(/[A-Z]/g, ''));
                          const isSelected = selectedSeats.includes(seatNumber);
                          const isBooked = seat.status === 'booked';
                          return (
                            <button
                              key={seat.id}
                              className={`w-6 h-6 text-xs rounded ${
                                isBooked
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-green-500 text-white'
                                  : 'bg-white border border-gray-300 hover:border-green-500 text-gray-700'
                              }`}
                              onClick={() => handleSeatClick(seat)}
                              disabled={isBooked}
                            >
                              {seat.number}
                            </button>
                          );
                        })}
                      </div>
                      <span className="w-6">{row}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prime Seats */}
              <div>
                <h3 className="text-center mb-4">PRIME (₹{selectedCinema.price + 30})</h3>
                <div className="grid gap-2">
                  {rows.prime.map(row => (
                    <div key={row} className="flex items-center gap-2">
                      <span className="w-6 text-right">{row}</span>
                      <div className="flex gap-1 flex-1 justify-center">
                        {generateSeats(row, 25).map(seat => {
                          const seatNumber = parseInt(seat.id.replace(/[A-Z]/g, ''));
                          const isSelected = selectedSeats.includes(seatNumber);
                          const isBooked = seat.status === 'booked';
                          return (
                            <button
                              key={seat.id}
                              className={`w-6 h-6 text-xs rounded ${
                                isBooked
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-green-500 text-white'
                                  : 'bg-white border border-gray-300 hover:border-green-500 text-gray-700'
                              }`}
                              onClick={() => handleSeatClick(seat)}
                              disabled={isBooked}
                            >
                              {seat.number}
                            </button>
                          );
                        })}
                      </div>
                      <span className="w-6">{row}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="w-80 bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex gap-4 mb-4">
              <img
                src={selectedMovie.image}
                alt={selectedMovie.title}
                className="w-20 h-28 object-cover rounded"
              />
              <div>
                <h3 className="font-bold">{selectedMovie.title}</h3>
                <p className="text-sm text-gray-600">{selectedMovie.certification} • {selectedMovie.genres}</p>
                <p className="text-sm">{selectedShowTime.time} • {selectedShowTime.languages}</p>
                <p className="text-sm">{selectedCinema.name}</p>
                <p className="text-sm text-gray-500">{selectedCinema.location}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold mb-2">SELECTED SEATS ({selectedSeats.length})</h4>
                {selectedSeats.length > 0 ? (
                  <div className="bg-gray-50 p-2 rounded">
                    {selectedSeats.map(seat => (
                      <span key={seat} className="inline-block mr-2">{seat}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No seats selected</p>
                )}
              </div>

              <div>
                <h4 className="font-bold mb-2">PAYMENT DETAILS</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tickets ({selectedSeats.length})</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>
              </div>

              <button 
                className={`w-full py-3 rounded-lg font-bold ${
                  selectedSeats.length > 0
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                disabled={selectedSeats.length === 0}
                onClick={() => navigate('/payment')}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;