import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

interface Seat {
  id: number;
  row: string;
  number: number;
  status: 'available' | 'selected' | 'booked';
}

const SeatSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  
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

  // Define rows for the theater
  const rows = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'
  ];
  
  // Generate all seats with unique numbers from 1 to 200
  const generateAllSeats = (): Seat[] => {
    const seats: Seat[] = [];
    let seatNumber = 1;
    
    for (const row of rows) {
      for (let i = 1; i <= 15; i++) {
        if (seatNumber <= 200) {
          seats.push({
            id: seatNumber,
            row,
            number: i,
            status: selectedCinema?.seatsBooked.includes(seatNumber) ? 'booked' : 'available'
          });
          seatNumber++;
        }
      }
    }
    
    return seats;
  };
  
  const allSeats = generateAllSeats();
  
  // Get seats for a specific row
  const getSeatsForRow = (row: string): Seat[] => {
    return allSeats.filter(seat => seat.row === row);
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;
    
    if (selectedSeats.includes(seat.id)) {
      dispatch(removeSelectedSeat(seat.id));
    } else {
      dispatch(addSelectedSeat(seat.id));
    }
  };

  if (!selectedMovie || !selectedCinema || !selectedShowTime) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="flex flex-col md:flex-row gap-8">
          {/* Seats Layout */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            {/* Screen */}
            <div className="text-center mb-10">
              <div className="w-3/4 h-8 mx-auto bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-t-full"></div>
              <p className="mt-2 text-sm text-gray-500 font-medium">SCREEN</p>
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

            {/* Seat Categories */}
            <div className="mb-4 flex justify-center gap-8">
              <div className="text-center">
                <span className="text-sm font-medium text-gray-600">PREMIUM - ₹{selectedCinema.price + 50}</span>
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-gray-600">EXECUTIVE - ₹{selectedCinema.price + 30}</span>
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-gray-600">REGULAR - ₹{selectedCinema.price}</span>
              </div>
            </div>

            {/* Seats */}
            <div className="space-y-8 overflow-x-auto">
              <div className="grid gap-2 pb-4">
                {/* Premium (First 3 rows) */}
                <div className="mb-8">
                  {rows.slice(0, 3).map(row => (
                    <div key={row} className="flex items-center gap-2 mb-2">
                      <span className="w-6 text-right font-medium text-gray-700">{row}</span>
                      <div className="flex gap-1 flex-1 justify-center">
                        {getSeatsForRow(row).map(seat => {
                          const isSelected = selectedSeats.includes(seat.id);
                          const isBooked = seat.status === 'booked';
                          return (
                            <button
                              key={seat.id}
                              className={`w-7 h-7 text-xs rounded ${
                                isBooked
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-green-500 text-white'
                                  : 'bg-white border border-red-300 hover:border-green-500 text-gray-700'
                              }`}
                              onClick={() => handleSeatClick(seat)}
                              disabled={isBooked}
                              title={`${seat.row}${seat.number} (Seat ${seat.id})`}
                            >
                              {seat.number}
                            </button>
                          );
                        })}
                      </div>
                      <span className="w-6 font-medium text-gray-700">{row}</span>
                    </div>
                  ))}
                </div>

                {/* Executive (Next 5 rows) */}
                <div className="mb-8">
                  {rows.slice(3, 8).map(row => (
                    <div key={row} className="flex items-center gap-2 mb-2">
                      <span className="w-6 text-right font-medium text-gray-700">{row}</span>
                      <div className="flex gap-1 flex-1 justify-center">
                        {getSeatsForRow(row).map(seat => {
                          const isSelected = selectedSeats.includes(seat.id);
                          const isBooked = seat.status === 'booked';
                          return (
                            <button
                              key={seat.id}
                              className={`w-7 h-7 text-xs rounded ${
                                isBooked
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-green-500 text-white'
                                  : 'bg-white border border-blue-300 hover:border-green-500 text-gray-700'
                              }`}
                              onClick={() => handleSeatClick(seat)}
                              disabled={isBooked}
                              title={`${seat.row}${seat.number} (Seat ${seat.id})`}
                            >
                              {seat.number}
                            </button>
                          );
                        })}
                      </div>
                      <span className="w-6 font-medium text-gray-700">{row}</span>
                    </div>
                  ))}
                </div>

                {/* Regular (Remaining rows) */}
                <div>
                  {rows.slice(8).map(row => (
                    <div key={row} className="flex items-center gap-2 mb-2">
                      <span className="w-6 text-right font-medium text-gray-700">{row}</span>
                      <div className="flex gap-1 flex-1 justify-center">
                        {getSeatsForRow(row).map(seat => {
                          const isSelected = selectedSeats.includes(seat.id);
                          const isBooked = seat.status === 'booked';
                          return (
                            <button
                              key={seat.id}
                              className={`w-7 h-7 text-xs rounded ${
                                isBooked
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-green-500 text-white'
                                  : 'bg-white border border-gray-300 hover:border-green-500 text-gray-700'
                              }`}
                              onClick={() => handleSeatClick(seat)}
                              disabled={isBooked}
                              title={`${seat.row}${seat.number} (Seat ${seat.id})`}
                            >
                              {seat.number}
                            </button>
                          );
                        })}
                      </div>
                      <span className="w-6 font-medium text-gray-700">{row}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="w-full md:w-80 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
            <div className="flex gap-4 mb-6">
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
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="flex flex-wrap gap-1">
                      {selectedSeats.map(seatId => {
                        const seat = allSeats.find(s => s.id === seatId);
                        return (
                          <span key={seatId} className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            {seat ? `${seat.row}${seat.number}` : seatId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No seats selected</p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-bold mb-2">PAYMENT DETAILS</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tickets ({selectedSeats.length})</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Convenience Fee</span>
                    <span>₹{selectedSeats.length > 0 ? 30 : 0}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                    <span>Total Amount</span>
                    <span>₹{totalAmount + (selectedSeats.length > 0 ? 30 : 0)}</span>
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