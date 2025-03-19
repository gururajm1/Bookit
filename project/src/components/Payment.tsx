import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

// Define the PaymentData interface
interface PaymentData {
  movieName: string;
  theatreName: string;
  theatreLocation: string;
  showTime: string;
  showDate: string;
  totalSeats: number;
  selectedSeats: string;
  ticketsAmount: number;
  convenienceFee: number;
  totalAmount: number;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Payment = () => {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);

    // Get payment data from session storage
    const storedData = sessionStorage.getItem('paymentData');
    if (storedData) {
      setPaymentData(JSON.parse(storedData));
    } else {
      navigate('/dash');
    }

    return () => {
      document.body.removeChild(script);
    };
  }, [navigate]);

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpiInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpiId(e.target.value);
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\//g, '')
      .replace(/(\d{2})(\d{2})/, '$1/$2')
      .substring(0, 5);
  };

  const handlePayment = () => {
    if (!paymentData) return;
    setIsLoading(true);
    setError('');

    // Validate inputs based on payment method
    if (paymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        setError('Please fill in all card details');
        setIsLoading(false);
        return;
      }
      
      // Basic validation
      if (cardDetails.number.replace(/\s/g, '').length !== 16) {
        setError('Please enter a valid 16-digit card number');
        setIsLoading(false);
        return;
      }
      
      if (cardDetails.cvv.length !== 3) {
        setError('Please enter a valid 3-digit CVV');
        setIsLoading(false);
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        setError('Please enter a valid UPI ID (e.g., username@upi)');
        setIsLoading(false);
        return;
      }
    }

    // In a real app, you would get this from your backend
    const razorpayKeyId = 'rzp_test_YLwVXou1nEvjrS'; // Razorpay test key

    if (!isScriptLoaded) {
      setError('Payment gateway is loading. Please try again.');
      setIsLoading(false);
      return;
    }

    // Configure Razorpay
    const options: RazorpayOptions = {
      key: razorpayKeyId,
      amount: paymentData.totalAmount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      name: 'Bookit',
      description: `Tickets for ${paymentData.movieName}`,
      handler: function(response) {
        console.log('Payment successful', response);
        handlePaymentSuccess(response);
      },
      prefill: {
        name: cardDetails.name || 'Customer',
        email: 'customer@example.com',
        contact: '9999999999'
      },
      notes: {
        address: paymentData.theatreLocation
      },
      theme: {
        color: '#E11D48' // Red color matching the app theme
      }
    };

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setIsLoading(false);
    } catch (error) {
      console.error('Razorpay error:', error);
      setError('Failed to initialize payment gateway. Please try again.');
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentResponse: any) => {
    try {
      if (!paymentData) return;

      console.log('Payment data:', paymentData); // Debug log

      // Update or create cinema with selected seats
      const updateResponse = await fetch('http://localhost:5001/bookit/cinema/seats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: paymentData.theatreName,
          address: paymentData.theatreLocation,
          location: paymentData.theatreLocation,
          selectedSeats: paymentData.selectedSeats.split(',').map(seat => seat.trim()),
          showDate: paymentData.showDate,
          showTime: paymentData.showTime,
          paymentId: paymentResponse.razorpay_payment_id // Add payment reference
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        console.error('Server error:', errorData); // Debug log
        throw new Error(`Failed to update cinema seats: ${errorData.message || 'Unknown error'}`);
      }

      const result = await updateResponse.json();
      console.log('Cinema seats updated:', result); // Debug log

      // Clear selected seats and payment data
      sessionStorage.removeItem('paymentData');
      
      // Show success message
      alert('Payment successful! Your tickets have been booked.');
      
      // Navigate to dashboard
      navigate('/dash');
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment successful but there was an error updating seat information. Please contact support.');
      navigate('/dash');
    }
  };

  if (!paymentData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button className="hover:text-red-500" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">SELECT SEATS</span>
              <span>›</span>
              <span className="font-bold">PAYMENT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Payment Form */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Payment Details</h2>

          {/* Payment Method Tabs */}
          <div className="flex mb-6 border-b">
            <button
              className={`py-2 px-4 font-medium ${
                paymentMethod === 'card'
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setPaymentMethod('card')}
            >
              Credit/Debit Card
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                paymentMethod === 'upi'
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setPaymentMethod('upi')}
            >
              UPI
            </button>
          </div>

          {/* Card Payment Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  name="number"
                  value={cardDetails.number}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    setCardDetails(prev => ({ ...prev, number: formatted }));
                  }}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    value={cardDetails.expiry}
                    onChange={(e) => {
                      const formatted = formatExpiryDate(e.target.value);
                      setCardDetails(prev => ({ ...prev, expiry: formatted }));
                    }}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardInputChange}
                    placeholder="123"
                    maxLength={3}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={cardDetails.name}
                  onChange={handleCardInputChange}
                  placeholder="John Doe"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          )}

          {/* UPI Payment Form */}
          {paymentMethod === 'upi' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPI ID
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={handleUpiInputChange}
                  placeholder="username@upi"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter your UPI ID (e.g., username@okicici, username@ybl)
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Payment Button */}
          <button
            className="mt-6 w-full py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : `Pay ₹${paymentData.totalAmount}`}
          </button>

          {/* Razorpay Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Secured by <span className="font-medium">Razorpay</span>
            </p>
            <div className="flex justify-center mt-2 space-x-2">
              <img
                src="https://cdn.razorpay.com/static/assets/merchant-badge/visa.png"
                alt="Visa"
                className="h-6"
              />
              <img
                src="https://cdn.razorpay.com/static/assets/merchant-badge/mastercard.png"
                alt="Mastercard"
                className="h-6"
              />
              <img
                src="https://cdn.razorpay.com/static/assets/merchant-badge/rupay.png"
                alt="RuPay"
                className="h-6"
              />
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="w-full md:w-80 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">{paymentData.movieName}</h3>
              <p className="text-sm text-gray-600">{paymentData.theatreName}</p>
              <p className="text-sm text-gray-500">{paymentData.theatreLocation}</p>
              <div className="mt-2">
                <p className="text-sm">
                  <span className="font-medium">Date & Time:</span> {paymentData.showDate}, {paymentData.showTime}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Seats:</span> {paymentData.selectedSeats}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-bold mb-2">PAYMENT DETAILS</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tickets ({paymentData.totalSeats})</span>
                  <span>₹{paymentData.ticketsAmount}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Convenience Fee</span>
                  <span>₹{paymentData.convenienceFee}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span>₹{paymentData.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Integration Note */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="font-bold text-yellow-800">Important Note for Razorpay Integration</h3>
        <p className="mt-2 text-sm text-yellow-700">
          To fully integrate Razorpay, you need to:
        </p>
        <ol className="mt-2 list-decimal list-inside text-sm text-yellow-700 space-y-1">
          <li>Sign up for a Razorpay account at <a href="https://razorpay.com" className="underline" target="_blank" rel="noopener noreferrer">razorpay.com</a></li>
          <li>Get your API key from the Razorpay Dashboard</li>
          <li>Replace 'YOUR_RAZORPAY_KEY_ID' in this component with your actual key</li>
          <li>For production, implement server-side verification of payments</li>
        </ol>
      </div>
    </div>
  );
};

export default Payment;
