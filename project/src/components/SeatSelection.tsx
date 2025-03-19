import React, { useState, useEffect, useMemo } from 'react';
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
  id: string;  
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
  const [ticketsAmount, setTicketsAmount] = useState(0);
  const [convenienceFee, setConvenienceFee] = useState(0);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);

  const rows = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'
  ];

  useEffect(() => {
    // Clear selected seats when component unmounts
    return () => {
      dispatch(clearSelectedSeats());
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchBookedSeats = async () => {
      if (!selectedCinema?.name || !selectedShowTime?.date || !selectedShowTime?.time || !selectedMovie?.title) return;

      try {
        const response = await fetch(
          `http://localhost:1004/bookit/cinema/booked-seats?theatreName=${encodeURIComponent(selectedCinema.name)}&date=${encodeURIComponent(selectedShowTime.date)}&showTime=${encodeURIComponent(selectedShowTime.time)}&movieName=${encodeURIComponent(selectedMovie.title)}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch booked seats');
        }

        const data = await response.json();
        if (data.success) {
          const bookedSeatsData = data.bookedSeats || [];
          setBookedSeats(bookedSeatsData);
          // Clear any selected seats that are now booked
          const selectedButBooked = selectedSeats.filter(seatId => bookedSeatsData.includes(seatId));
          if (selectedButBooked.length > 0) {
            selectedButBooked.forEach(seatId => {
              dispatch(removeSelectedSeat(seatId));
            });
          }
        }
      } catch (error) {
        console.error('Error fetching booked seats:', error);
        setBookedSeats([]);
      }
    };

    fetchBookedSeats();
  }, [selectedCinema?.name, selectedShowTime?.date, selectedShowTime?.time, selectedMovie?.title, dispatch, selectedSeats]);
  
  const allSeats = useMemo(() => {
    const seats: Seat[] = [];
    
    for (const row of rows) {
      for (let i = 1; i <= 15; i++) {
        const seatId = `${row}${i}`;
        seats.push({
          id: seatId,
          row,
          number: i,
          status: bookedSeats.includes(seatId) ? 'booked' : 
                 selectedSeats.includes(seatId) ? 'selected' : 'available'
        });
      }
    }
    
    return seats;
  }, [rows, bookedSeats, selectedSeats]);
  
  const getSeatsForRow = (row: string): Seat[] => {
    return allSeats.filter(seat => seat.row === row);
  };

  useEffect(() => {
    if (!selectedMovie || !selectedCinema || !selectedShowTime) {
      navigate('/dash');
    }
  }, [selectedMovie, selectedCinema, selectedShowTime, navigate]);

  useEffect(() => {
    if (selectedSeats.length > 0 && selectedCinema) {
      let ticketsTotal = 0;
      const convenienceFeePerTicket = 5;
      const totalConvenienceFee = selectedSeats.length * convenienceFeePerTicket;
      
      selectedSeats.forEach(seatId => {
        const seat = allSeats.find(s => s.id === seatId);
        if (seat) {
          const row = seat.row;
          let seatPrice = selectedCinema.price;
          
          if (row >= 'I' && row <= 'N') {
            seatPrice += 50;
          } 
          else if (row >= 'D' && row <= 'H') {
            seatPrice += 20;
          }
          
          ticketsTotal += seatPrice;
        }
      });
      
      setTicketsAmount(ticketsTotal);
      setConvenienceFee(totalConvenienceFee);
      setTotalAmount(ticketsTotal + totalConvenienceFee);
    } else {
      setTicketsAmount(0);
      setConvenienceFee(0);
      setTotalAmount(0);
    }
  }, [selectedSeats, selectedCinema, allSeats]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;
    
    if (selectedSeats.includes(seat.id)) {
      dispatch(removeSelectedSeat(seat.id));
    } else if (selectedSeats.length < 200) { 
      dispatch(addSelectedSeat(seat.id));
    }
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    if (!selectedMovie || !selectedCinema || !selectedShowTime) {
      console.error('Missing required data');
      navigate('/dash');
      return;
    }
    
    // Ensure all required data is available in Redux store
    if (!selectedMovie.title || !selectedCinema.name || !selectedCinema.location || 
        !selectedShowTime.time || !selectedShowTime.date) {
      console.error('Invalid data in Redux store');
      navigate('/dash');
      return;
    }

    const paymentData = {
      movieName: selectedMovie.title,
      theatreName: selectedCinema.name,
      theatreLocation: selectedCinema.location,
      showTime: selectedShowTime.time,
      showDate: selectedShowTime.date,
      totalSeats: selectedSeats.length,
      selectedSeats: selectedSeats.join(', '),
      ticketsAmount: ticketsAmount,
      convenienceFee: convenienceFee,
      totalAmount: totalAmount
    };

    try {
      // Store payment data in sessionStorage
      sessionStorage.setItem('paymentData', JSON.stringify(paymentData));
      // Navigate to payment page
      navigate('/payment');
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  if (!selectedMovie || !selectedCinema || !selectedShowTime) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
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

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-10">
              <div className="w-3/4 h-8 mx-auto bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-t-full"></div>
              <p className="mt-2 text-sm text-gray-500 font-medium">SCREEN</p>
            </div>

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

            <div className="mb-4 flex justify-center gap-8">
              <div className="text-center">
                <span className="text-sm font-medium text-gray-600">PREMIUM (I-N) - ₹{selectedCinema.price + 50}</span>
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-gray-600">EXECUTIVE (D-H) - ₹{selectedCinema.price + 20}</span>
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-gray-600">REGULAR (A-C) - ₹{selectedCinema.price}</span>
              </div>
            </div>

            <div className="space-y-8 overflow-x-auto">
              <div className="grid gap-2 pb-4">
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
                            title={`${seat.row}${seat.number}`}
                          >
                            {seat.number}
                          </button>
                        );
                      })}
                    </div>
                    <span className="w-6 font-medium text-gray-700">{row}</span>
                  </div>
                ))}
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
                            title={`${seat.row}${seat.number}`}
                          >
                            {seat.number}
                          </button>
                        );
                      })}
                    </div>
                    <span className="w-6 font-medium text-gray-700">{row}</span>
                  </div>
                ))}
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
                            title={`${seat.row}${seat.number}`}
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
                      {selectedSeats.map(seatId => (
                        <span key={seatId} className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {seatId}
                        </span>
                      ))}
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
                    <span>₹{ticketsAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Convenience Fee</span>
                    <span>₹{convenienceFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
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
                onClick={handleProceedToPayment}
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