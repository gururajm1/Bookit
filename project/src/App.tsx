import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Header from './components/Header';
import MovieList from './components/MovieList';
import BookingPage from './components/BookingPage';
import SeatSelection from './components/SeatSelection';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import authService from './services/authService';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dash" element={<MovieList />} />
              <Route path="/movie/:id/booking" element={<BookingPage />} />
              <Route path="/movie/:id/seats" element={<SeatSelection />} />
            </Route>
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;