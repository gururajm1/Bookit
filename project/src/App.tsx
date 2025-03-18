import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { isAuthenticated } from './services/authService';

// Components
import Header from './components/Header';
import MovieList from './components/MovieList';
import BookingPage from './components/BookingPage';
import SeatSelection from './components/SeatSelection';
import Login from './Auth/Login';
import Signup from './Auth/Signup';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  console.log('Checking authentication...');
  const isAuth = isAuthenticated();
  console.log('Is authenticated:', isAuth);
  if (!isAuth) {
    // Save the current path for redirect after login
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

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
            <Route path="/dash" element={
              <ProtectedRoute>
                <MovieList />
              </ProtectedRoute>
            } />
            <Route path="/movie/:id/booking" element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            } />
            <Route path="/movie/:id/seats" element={
              <ProtectedRoute>
                <SeatSelection />
              </ProtectedRoute>
            } />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;