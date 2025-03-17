import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MovieList from './components/MovieList';
import BookingPage from './components/BookingPage';
import SeatSelection from './components/SeatSelection';
import Login from './Auth/Login';
import Signup from './Auth/Signup';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <MovieList />
              </>
            }
          />
          <Route path="/movie/:id/booking" element={<BookingPage />} />
          <Route path="/movie/:id/seats" element={<SeatSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;