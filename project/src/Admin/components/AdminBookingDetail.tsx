import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Ticket, MapPin, Phone, Mail, Trash2 } from 'lucide-react';

interface BookingDetail {
  id: string;
  movieTitle: string;
  locationName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  showDate: string;
  showTime: string;
  seats: string[];
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'pending';
  bookingDate: string;
  paymentMethod: string;
  paymentStatus: string;
  bookingReference: string;
}

const AdminBookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5001/bookit/admin/bookings/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch booking details');
      const data = await response.json();
      setBooking(data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setError('Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await fetch(`http://localhost:5001/bookit/admin/bookings/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to cancel booking');
      fetchBookingDetails();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error || 'Booking not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/bookings')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold">Booking Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Movie and Show Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Movie & Show Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{booking.movieTitle}</h3>
                <div className="flex items-center gap-2 text-gray-500 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{booking.locationName}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{new Date(booking.showDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{booking.showTime}</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Selected Seats</h4>
                <div className="flex flex-wrap gap-2">
                  {booking.seats.map((seat, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount</span>
                <span className="text-lg font-semibold">₹{booking.totalAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">{booking.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Status</span>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  booking.paymentStatus === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Booking Reference</span>
                <span className="font-medium">{booking.bookingReference}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - User Details and Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">User Details</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="font-medium">{booking.userName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <span>{booking.userEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-500" />
                <span>{booking.userPhone}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Booking Status</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Booking Date</span>
                <span>{new Date(booking.bookingDate).toLocaleString()}</span>
              </div>
              {booking.status === 'confirmed' && (
                <button
                  onClick={handleCancelBooking}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDetail; 