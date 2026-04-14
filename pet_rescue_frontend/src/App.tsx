import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';

// Public / User pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdoptionPage from './pages/AdoptionPage';
import RescuePage from './pages/RescuePage';
import AboutPage from './pages/AboutPage';
import Dashboard from './pages/dashboard';
import Profile from './pages/profile';
import CreateReport from './pages/CreateReport';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManagePets from './pages/admin/ManagePets';
import ManageReports from './pages/admin/ManageReports';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* User-facing routes */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/adoption" element={<AdoptionPage />} />
            <Route path="/rescue" element={<RescuePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-report" element={<CreateReport />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/pets" element={<ManagePets />} />
            <Route path="/admin/reports" element={<ManageReports />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
