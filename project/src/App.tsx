import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';

import Header from './components/Header';
import MovieList from './components/MovieList';
import BookingPage from './components/BookingPage';
import SeatSelection from './components/SeatSelection';
import Payment from './components/Payment';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import BookedTickets from './components/BookedTickets';
import Dashboard from './components/dashboard';
import HomePage from './pages/HomePage';
import { isAuthenticated } from './services/authService';

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = isAuthenticated();
  
  if (isAuth) {
    return <Navigate to="/dash" />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="relative">
            <Routes>
              <Route path="/" element={
                <PublicOnlyRoute>
                  <HomePage />
                </PublicOnlyRoute>
              } />
              <Route path="/login" element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              } />
              <Route path="/signup" element={
                <PublicOnlyRoute>
                  <Signup />
                </PublicOnlyRoute>
              } />
              
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
              <Route path="/booked-tickets" element={
                <ProtectedRoute>
                  <BookedTickets />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={
                isAuthenticated() ? 
                <Navigate to="/dash" replace /> : 
                <Navigate to="/" replace />
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;