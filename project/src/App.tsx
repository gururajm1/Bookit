import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Components
import Header from './components/Header';
import MovieList from './components/MovieList';
import BookingPage from './components/BookingPage';
import SeatSelection from './components/SeatSelection';
import Payment from './components/Payment';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import ProtectedRoute from './components/ProtectedRoute';

/* Admin Protected Route Component - Uncomment when implementing admin features
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = isAuthenticated();
  const admin = isAdmin();
  
  if (!isAuth || !admin) {
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};
*/

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

            {/* Admin Routes - Commented out until admin components are implemented */}
            {/* <Route path="/admin/*" element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } /> */}
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;