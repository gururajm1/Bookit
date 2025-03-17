import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'selected' | 'occupied';
  price: number;
}

const SeatSelection = () => {
  const { id } = useParams();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // Generate seats layout
  const generateSeats = (row: string, count: number, price: number): Seat[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `${row}${i + 1}`,
      row,
      number: i + 1,
      status: 'available',
      price
    }));
  };

  const rows = {
    classic: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    prime: ['J', 'K', 'L', 'M']
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'occupied') return;

    const newSelectedSeats = selectedSeats.includes(seat)
      ? selectedSeats.filter(s => s.id !== seat.id)
      : [...selectedSeats, seat];

    setSelectedSeats(newSelectedSeats);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button className="hover:text-yellow-400">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span>SELECT SEATS</span>
                <span>›</span>
                <span className="text-gray-400">CHOOSE CINEMA</span>
                <span>›</span>
                <span className="text-gray-400">GRAB FOOD</span>
                <span>›</span>
                <span className="text-gray-400">PAYMENT</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="font-bold">Booking Summary</h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Seats Layout */}
          <div className="flex-1">
            {/* Date and Time Selection */}
            <div className="mb-8">
              <select className="px-4 py-2 border border-gray-200 rounded-md">
                <option>17 Mar, Monday</option>
              </select>
            </div>

            {/* Screen */}
            <div className="text-center mb-12">
              <div className="w-3/4 h-8 mx-auto bg-gray-200 rounded-t-full"></div>
              <p className="mt-2 text-sm text-gray-500">SCREEN</p>
            </div>

            {/* Seats */}
            <div className="space-y-12">
              {/* Classic Seats */}
              <div>
                <h3 className="text-center mb-4">CLASSIC (₹330.00)</h3>
                <div className="grid gap-2">
                  {rows.classic.map(row => (
                    <div key={row} className="flex items-center gap-2">
                      <span className="w-6 text-right">{row}</span>
                      <div className="flex gap-1 flex-1 justify-center">
                        {generateSeats(row, 25, 330).map(seat => (
                          <button
                            key={seat.id}
                            className={`w-6 h-6 text-xs rounded ${
                              seat.status === 'selected'
                                ? 'bg-yellow-400 text-white'
                                : seat.status === 'occupied'
                                ? 'bg-gray-200 cursor-not-allowed'
                                : 'bg-white border border-gray-300 hover:border-yellow-400'
                            }`}
                            onClick={() => handleSeatClick(seat)}
                          >
                            {seat.number}
                          </button>
                        ))}
                      </div>
                      <span className="w-6">{row}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prime Seats */}
              <div>
                <h3 className="text-center mb-4">PRIME (₹360.00)</h3>
                <div className="grid gap-2">
                  {rows.prime.map(row => (
                    <div key={row} className="flex items-center gap-2">
                      <span className="w-6 text-right">{row}</span>
                      <div className="flex gap-1 flex-1 justify-center">
                        {generateSeats(row, 25, 360).map(seat => (
                          <button
                            key={seat.id}
                            className={`w-6 h-6 text-xs rounded ${
                              seat.status === 'selected'
                                ? 'bg-yellow-400 text-white'
                                : seat.status === 'occupied'
                                ? 'bg-gray-200 cursor-not-allowed'
                                : 'bg-white border border-gray-300 hover:border-yellow-400'
                            }`}
                            onClick={() => handleSeatClick(seat)}
                          >
                            {seat.number}
                          </button>
                        ))}
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
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1"
                alt="Movie"
                className="w-20 h-28 object-cover rounded"
              />
              <div>
                <h3 className="font-bold">THE DIPLOMAT</h3>
                <p className="text-sm text-gray-600">UA 13+ • Drama • Hindi</p>
                <p className="text-sm">Mon, 17 Mar, 7:25 PM - 10:17 PM</p>
                <p className="text-sm">Bookit Plaza-CP, Delhi</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold mb-2">SEAT INFO</h4>
                <div className="bg-yellow-50 p-2 rounded">
                  <p className="font-bold">CLASSIC</p>
                  <p>D18</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-2">TICKETS</h4>
                <p>1 x 330</p>
              </div>

              <div>
                <h4 className="font-bold mb-2">PAYMENT DETAILS</h4>
                <div className="flex justify-between">
                  <span>Sub Total</span>
                  <span>₹330.00</span>
                </div>
              </div>

              <button className="w-full py-3 bg-yellow-400 text-white rounded-lg font-bold hover:bg-yellow-500">
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;