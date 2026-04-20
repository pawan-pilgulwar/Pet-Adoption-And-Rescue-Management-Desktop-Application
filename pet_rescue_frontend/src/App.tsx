import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public pages
import Home from './modules/core/pages/Home';
import Login from './modules/auth/pages/Login';
import Register from './modules/auth/pages/Register';
import About from './modules/core/pages/About';
import Adoption from './modules/adoption/pages/Adoption';
import AdoptionDetail from './modules/adoption/pages/AdoptionDetail';
import Rescue from './modules/rescue/pages/Rescue';
import Services from './modules/services/pages/Services';
import Booking from './modules/services/pages/Booking';

// Dashboard (role-based)
import Dashboard from './modules/dashboard/user/index';
import MyReports from './modules/dashboard/user/MyReports';
import CreateReport from './modules/rescue/pages/CreateReport';
import MyAdoptions from './modules/dashboard/user/MyAdoptions';
import MyRescue from './modules/dashboard/user/MyRescue';
import ShopPets from './modules/dashboard/user/ShopPets';
import ShopListings from './modules/dashboard/user/ShopListings';
import ShopServices from './modules/dashboard/user/ShopServices';

// Profile
import Profile from './modules/profile/pages/Profile';

// Admin pages
import AdminDashboard from './modules/dashboard/admin/AdminDashboard';
import AdminUsers from './modules/dashboard/admin/AdminUsers';
import AdminPets from './modules/dashboard/admin/AdminPets';
import AdminListings from './modules/dashboard/admin/AdminListings';
import AdminAdoptions from './modules/dashboard/admin/AdminAdoptions';
import AdminReports from './modules/dashboard/admin/AdminReports';
import AdminRescue from './modules/dashboard/admin/AdminRescue';
import AdminServices from './modules/dashboard/admin/AdminServices';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/adoption" element={<Adoption />} />
            <Route path="/adoption/:id" element={<AdoptionDetail />} />
            <Route path="/rescue" element={<Rescue />} />
            <Route path="/services" element={<Services />} />
            <Route path="/booking" element={<Booking />} />
          </Route>

          {/* User & Shop Owner dashboard */}
          <Route element={<DashboardLayout allowedRoles={['USER', 'SHOP_OWNER']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/reports" element={<MyReports />} />
            <Route path="/dashboard/reports/new" element={<CreateReport />} />
            <Route path="/dashboard/adoptions" element={<MyAdoptions />} />
            <Route path="/dashboard/rescue" element={<MyRescue />} />
            {/* Shop owner only */}
            <Route path="/dashboard/pets" element={<ShopPets />} />
            <Route path="/dashboard/listings" element={<ShopListings />} />
            <Route path="/dashboard/services" element={<ShopServices />} />
          </Route>

          {/* Profile (all authenticated) */}
          <Route element={<DashboardLayout />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin routes */}
          <Route element={<DashboardLayout allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/pets" element={<AdminPets />} />
            <Route path="/admin/listings" element={<AdminListings />} />
            <Route path="/admin/adoptions" element={<AdminAdoptions />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/rescue" element={<AdminRescue />} />
            <Route path="/admin/services" element={<AdminServices />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
