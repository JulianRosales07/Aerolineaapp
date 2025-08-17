import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Booking from './pages/Booking';
import BookingDetails from './pages/BookingDetails';
import CustomizeTrip from './pages/CustomizeTrip';
import SeatSelection from './pages/SeatSelection';
import Payment from './pages/Payment';
import Ticket from './pages/Ticket';
import TicketTest from './pages/TicketTest';
import Offers from './pages/Offers';
import CheckIn from './pages/CheckIn';
import Info from './pages/Info';
import AdminLayout from './pages/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AircraftManagement from './pages/admin/AircraftManagement';
import AirportManagement from './pages/admin/AirportManagement';
import UserManagement from './pages/admin/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking-details" element={<BookingDetails />} />
            <Route path="/customize-trip" element={<CustomizeTrip />} />
            <Route path="/seat-selection" element={<SeatSelection />} />
            <Route path="/payment" element={
              <ErrorBoundary>
                <Payment />
              </ErrorBoundary>
            } />
            <Route path="/ticket" element={
              <ErrorBoundary>
                <Ticket />
              </ErrorBoundary>
            } />
            <Route path="/offers" element={<Offers />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/info" element={<Info />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="aircraft" element={
                <ProtectedRoute>
                  <AircraftManagement />
                </ProtectedRoute>
              } />
              <Route path="airports" element={
                <ProtectedRoute>
                  <AirportManagement />
                </ProtectedRoute>
              } />
              <Route path="users" element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;