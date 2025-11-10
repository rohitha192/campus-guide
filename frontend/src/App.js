import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import all necessary components once
import Login from './components/Login';
import Register from './components/Register';
import DashboardLayout from './components/dashboard/DashboardLayout';
import MapNavigator from './components/dashboard/MapNavigator';
import Events from './components/dashboard/Events';
import CampusQueries from './components/dashboard/CampusQueries';
import './App.css';

// PrivateRoute wrapper to protect routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Route with all the nested sections */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* Nested routes that render inside the dashboard's <Outlet> */}
          <Route index element={<MapNavigator />} />
          <Route path="map" element={<MapNavigator />} />
          <Route path="events" element={<Events />} />
          <Route path="queries" element={<CampusQueries />} /> 
        </Route>

        {/* Catch-all route to redirect any unknown URL to the login page */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

