import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import authService from '../services/authService';

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

const BookedTickets: FC = () => {
  const navigate = useNavigate();
  const [bookedTickets, setBookedTickets] = useState<BookedTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookedTickets = async () => {
      try {
        if (!authService.isAuthenticated()) {
          navigate('/login');
          return;
        }

        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          if (!user.email) {
            throw new Error('User email not found');
          }
          localStorage.setItem('userEmail', user.email);
        }

        const response = await fetch(`http://localhost:5002/bookit/user/booked-tickets?email=${encodeURIComponent(userEmail || JSON.parse(localStorage.getItem('user') || '{}').email)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch booked tickets');
        }

        const data = await response.json();
        if (data.success) {
          setBookedTickets(data.tickets);
        } else {
          throw new Error(data.message || 'Failed to fetch tickets');
        }
      } catch (error) {
        console.error('Error fetching booked tickets:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBookedTickets();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="p-8 bg-white rounded-2xl shadow-lg">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-xl font-medium text-gray-700">Loading your tickets...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="p-8 bg-white rounded-2xl shadow-lg text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-xl font-medium text-gray-800">{error}</p>
          <button
            onClick={() => navigate('/dash')}
            className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button 
            className="p-2 hover:bg-white hover:shadow-md rounded-full transition-all duration-200" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold ml-4 text-gray-800">My Booked Tickets</h1>
        </div>

        {bookedTickets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="w-24 h-24 mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <p className="text-2xl font-medium text-gray-600 mb-4">No tickets booked yet</p>
            <p className="text-gray-500 mb-8">Start your movie journey today!</p>
            <button
              onClick={() => navigate('/dash')}
              className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Book Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookedTickets.map((ticket, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Movie Info Section */}
                  <div className="bg-red-500 p-6 md:w-1/4 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-white truncate">{ticket.movieName}</h3>
                    <p className="text-red-100 mt-1">{ticket.movieCertification} • {ticket.language}</p>
                    <p className="text-red-100 mt-2 text-sm">{ticket.genres}</p>
                  </div>

                  {/* Theatre & Show Details */}
                  <div className="p-6 md:w-2/4 border-r border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">Theatre</p>
                        <p className="font-medium text-gray-800">{ticket.theatreName}</p>
                        <p className="text-sm text-gray-600">{ticket.theatreLocation}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Show Time</p>
                        <p className="font-medium text-gray-800">
                          {new Date(ticket.showDate).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-600">{ticket.showTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* Seats & Amount */}
                  <div className="p-6 md:w-1/4 bg-gray-50 flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Seats</p>
                      <div className="flex flex-wrap gap-2">
                        {ticket.selectedSeats.map((seat, seatIndex) => (
                          <span 
                            key={seatIndex}
                            className="px-2 py-1 text-sm bg-red-50 text-red-600 rounded-md"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">Amount Paid</p>
                      <p className="text-xl font-bold text-gray-800">₹{ticket.totalAmount}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedTickets;
