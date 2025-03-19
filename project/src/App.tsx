import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { isAuthenticated, isAdmin } from './services/authService';

// Components
import Header from './components/Header';
import MovieList from './components/MovieList';
import BookingPage from './components/BookingPage';
import SeatSelection from './components/SeatSelection';
import Payment from './components/Payment';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import MovieDetail from './components/MovieDetail';
import BookingConfirmation from './components/BookingConfirmation';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Components
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/components/AdminDashboard';
import AdminMovieList from './admin/components/AdminMovieList';
import AdminLocationList from './admin/components/AdminLocationList';
import AdminBookingList from './admin/components/AdminBookingList';
import AdminMovieForm from './admin/components/AdminMovieForm';
import AdminLocationForm from './admin/components/AdminLocationForm';

// Admin Protected Route Component
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = isAuthenticated();
  const admin = isAdmin();
  
  if (!isAuth || !admin) {
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
            <Route path="/payment" element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/movies" element={
              <AdminProtectedRoute>
                <AdminMovieList />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/movies/add" element={
              <AdminProtectedRoute>
                <AdminMovieForm />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/movies/edit/:id" element={
              <AdminProtectedRoute>
                <AdminMovieForm />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/locations" element={
              <AdminProtectedRoute>
                <AdminLocationList />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/locations/add" element={
              <AdminProtectedRoute>
                <AdminLocationForm />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/locations/edit/:id" element={
              <AdminProtectedRoute>
                <AdminLocationForm />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/bookings" element={
              <AdminProtectedRoute>
                <AdminBookingList />
              </AdminProtectedRoute>
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