import React from 'react';

const QuickBook = () => {
  return (
    <div className="bg-[#fff8eb] py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">Quick Book</span>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-white rounded-md text-sm font-medium border border-gray-200 hover:border-yellow-400">
              Movie
            </button>
            <button className="px-4 py-2 bg-transparent rounded-md text-sm font-medium hover:bg-white">
              Cinema
            </button>
          </div>
          <div className="flex-1 grid grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Select Movie"
              className="px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-yellow-400"
            />
            <input
              type="text"
              placeholder="Select Date"
              className="px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-yellow-400"
            />
          </div>
          <button className="px-5 py-2 bg-yellow-400 text-white rounded-md font-medium hover:bg-yellow-500">
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickBook;