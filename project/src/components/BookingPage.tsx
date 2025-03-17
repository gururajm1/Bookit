import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Heart, Share2, Search } from 'lucide-react';
import { format } from 'date-fns';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTimeRange, setShowTimeRange] = useState([8, 24]);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const handleTimeClick = () => {
    navigate(`/movie/${id}/seats`);
  };

  const cinemas = [
    {
      id: 1,
      name: "INOX Pacific Mall, Jasola Delhi",
      address: "Bookit INOX Limited, Delhi Pacific Mall, Pacific Mall",
      distance: "11.4 km away",
      showTimes: [{ time: "03:55 PM", language: "ENGLISH" }]
    },
    {
      id: 2,
      name: "Bookit Select City Walk Delhi",
      address: "A-51st Floor,Select City Walk Mall, District Center,Saket,Sector 6, Pushp Vihar,Delhi,NCR 110017,India",
      distance: "11.6 km away",
      showTimes: []
    },
    // Add more cinemas...
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Movie Header */}
      <div className="bg-gradient-to-b from-black to-transparent">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center text-white gap-4">
            <button className="hover:text-yellow-400">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">The Day the Earth Blew Up: A Looney Tunes Movie</h1>
              <div className="flex items-center gap-2 text-sm mt-1">
                <span className="px-2 py-0.5 border border-white/30 rounded">U</span>
                <span>1h 31m</span>
                <span>•</span>
                <span>Animation, Adventure, Comedy</span>
                <span>•</span>
                <span>English</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className="border-t border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 py-4">
            {dates.map((date, i) => (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center p-2 rounded ${
                  date.toDateString() === selectedDate.toDateString()
                    ? 'bg-yellow-400 text-white'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span className="text-sm">{format(date, 'EEE')}</span>
                <span className="text-xl font-bold">{format(date, 'd')}</span>
                <span className="text-sm">{format(date, 'MMM')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for cinema"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-yellow-400"
              />
            </div>
            <div className="flex items-center gap-4">
              <select className="px-4 py-2 rounded-lg border border-gray-200">
                <option>Languages</option>
              </select>
              <select className="px-4 py-2 rounded-lg border border-gray-200">
                <option>Formats</option>
              </select>
              <select className="px-4 py-2 rounded-lg border border-gray-200">
                <option>Experiences</option>
              </select>
              <select className="px-4 py-2 rounded-lg border border-gray-200">
                <option>Accessibility</option>
              </select>
              <select className="px-4 py-2 rounded-lg border border-gray-200">
                <option>Select Special Tags</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Cinema List */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          {cinemas.map((cinema) => (
            <div key={cinema.id} className="bg-white rounded-lg p-6 mb-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl font-bold">{cinema.name}</h2>
                  <p className="text-sm text-gray-500">{cinema.address}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{cinema.distance}</span>
                  <button className="text-gray-600 hover:text-yellow-400">
                    <MapPin className="w-5 h-5" />
                  </button>
                  <button className="text-gray-600 hover:text-yellow-400">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                {cinema.showTimes.map((show, index) => (
                  <button
                    key={index}
                    onClick={handleTimeClick}
                    className="px-6 py-3 border border-gray-200 rounded hover:border-yellow-400 text-center"
                  >
                    <span className="block text-sm text-gray-600">{show.language}</span>
                    <span className="block font-bold mt-1">{show.time}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;