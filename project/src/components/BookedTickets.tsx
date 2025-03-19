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

        const response = await fetch(`http://localhost:5006/bookit/user/booked-tickets?email=${encodeURIComponent(userEmail || JSON.parse(localStorage.getItem('user') || '{}').email)}`);
        
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your tickets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-8">
          <button className="hover:text-red-500" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold ml-4">My Booked Tickets</h1>
        </div>

        {bookedTickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No tickets booked yet</p>
            <button
              onClick={() => navigate('/dash')}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Book Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookedTickets.map((ticket, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{ticket.movieName}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-sm">
                        {ticket.movieCertification}
                      </span>
                      <span className="text-sm text-gray-600">{ticket.language}</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{ticket.genres}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {new Date(ticket.bookingDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Theatre:</span> {ticket.theatreName}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {ticket.theatreLocation}
                  </div>
                  <div>
                    <span className="font-medium">Show:</span> {ticket.showDate} at {ticket.showTime}
                  </div>
                  <div>
                    <span className="font-medium">Seats:</span>{' '}
                    {ticket.selectedSeats.join(', ')}
                  </div>
                  <div className="pt-2 border-t">
                    <span className="font-medium">Amount Paid:</span>{' '}
                    <span className="text-green-600 font-medium">₹{ticket.totalAmount}</span>
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
