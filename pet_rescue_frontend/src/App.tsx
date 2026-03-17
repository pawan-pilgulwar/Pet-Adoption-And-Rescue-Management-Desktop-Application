import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportPet from './pages/ReportPet';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Adoption from './pages/Adoption';
import Rescue from './pages/Rescue';
import Profile from './pages/Profile';
import { authService } from './services/api';
import About from './pages/About';

// Protected Route Component (Requires Login)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

// User-Only Route Component (Prevents Admin access)
const UserRoute = ({ children }: { children: React.ReactNode }) => {
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'Admin' || user.role === 'SuperAdmin') return <Navigate to="/admin-dashboard" />;
  return <>{children}</>;
};

// Admin Route Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = authService.getCurrentUser();
  if (!user || (user.role !== 'Admin' && user.role !== 'SuperAdmin')) return <Navigate to="/" />;
  return <>{children}</>;
};

const AdminDashboardRedirect = () => {
  const user = authService.getCurrentUser();
  if (user && ['Admin', 'SuperAdmin'].includes(user.role)) {
    return <Navigate to="/admin-dashboard" />;
  }
  return <Home />;
};

function App() {
  return (
    <div className="App min-h-screen bg-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<AdminDashboardRedirect />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/adoption"
            element={
              <UserRoute>
                <Adoption />
              </UserRoute>
            }
          />

          <Route
            path="/rescue"
            element={
              <UserRoute>
                <Rescue />
              </UserRoute>
            }
          />

          <Route
            path="/report"
            element={
              <UserRoute>
                <ReportPet />
              </UserRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <UserRoute>
                <UserDashboard />
              </UserRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </main>


      <footer className="bg-white border-t border-gray-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm font-medium">
            &copy; 2026 PetRescue Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
