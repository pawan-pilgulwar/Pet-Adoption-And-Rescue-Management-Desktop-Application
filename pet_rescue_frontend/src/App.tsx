import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public pages
import Home from './features/core/pages/Home';
import About from './features/core/pages/About';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import AdoptionPage from './features/adoption/pages/AdoptionPage';
import AdoptionDetail from './features/adoption/pages/AdoptionDetail';
import RescuePage from './features/rescue/pages/RescuePage';
import CreateReport from './features/rescue/pages/CreateReport';
import ServicesPage from './features/services/pages/ServicesPage';
import ServiceDetail from './features/services/pages/ServiceDetail';
import BookingPage from './features/services/pages/BookingPage';
import RescueDetail from './features/rescue/pages/RescueDetail';

// Dashboard (role-based)
import Dashboard from './features/dashboard/pages/Dashboard';
import MyReports from './features/dashboard/user/MyReports';
import MyAdoptions from './features/dashboard/user/MyAdoptions';
import MyRescue from './features/dashboard/user/MyRescue';
import ShopPets from './features/dashboard/shop/ShopPets';
import ShopListings from './features/dashboard/shop/ShopListings';
import ShopServices from './features/dashboard/shop/ShopServices';
import ShopBookings from './features/dashboard/shop/ShopBookings';
import ShopPetDetail from './features/dashboard/shop/ShopPetDetail';
import ShopServiceDetail from './features/dashboard/shop/ShopServiceDetail';
import ShopReportDetail from './features/dashboard/shop/ShopReportDetail';
import ShopBookingDetail from './features/dashboard/shop/ShopBookingDetail';
import ShopListingDetail from './features/dashboard/shop/ShopListingDetail';

// Admin pages
import AdminDashboard from './features/dashboard/admin/AdminDashboard';
import AdminUsers from './features/dashboard/admin/AdminUsers';
import AdminPets from './features/dashboard/admin/AdminPets';
import AdminReports from './features/dashboard/admin/AdminReports';
import AdminServices from './features/dashboard/admin/AdminServices';
import AdminUserDetail from './features/dashboard/admin/AdminUserDetail';
import AdminPetDetail from './features/dashboard/admin/AdminPetDetail';
import AdminReportDetail from './features/dashboard/admin/AdminReportDetail';
import AdminServiceDetail from './features/dashboard/admin/AdminServiceDetail';

// Profile
import Profile from './features/profile/pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ─── Public Routes ─── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/adoption" element={<AdoptionPage />} />
            <Route path="/adoption/:id" element={<AdoptionDetail />} />
            <Route path="/rescue" element={<RescuePage />} />
            <Route path="/rescue/:id" element={<RescueDetail />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/booking" element={<BookingPage />} />
          </Route>

          {/* ─── User & Shop Owner Dashboard ─── */}
          <Route element={<DashboardLayout allowedRoles={['USER', 'SHOP_OWNER']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/reports" element={<MyReports />} />
            <Route path="/dashboard/reports/new" element={<CreateReport />} />
            <Route path="/dashboard/adoptions" element={<MyAdoptions />} />
            <Route path="/dashboard/rescue" element={<MyRescue />} />
            {/* Shop Owner routes */}
            <Route path="/dashboard/pets" element={<ShopPets />} />
            <Route path="/dashboard/listings" element={<ShopListings />} />
            <Route path="/dashboard/services" element={<ShopServices />} />
            <Route path="/dashboard/bookings" element={<ShopBookings />} />
            <Route path="/dashboard/pets/:id" element={<ShopPetDetail />} />
            <Route path="/dashboard/services/:id" element={<ShopServiceDetail />} />
            <Route path="/dashboard/reports/:id" element={<ShopReportDetail />} />
            <Route path="/dashboard/bookings/:id" element={<ShopBookingDetail />} />
            <Route path="/dashboard/listings/:id" element={<ShopListingDetail />} />
          </Route>

          {/* ─── Profile (all authenticated roles) ─── */}
          <Route element={<DashboardLayout />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<DashboardLayout allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/reports/:id" element={<AdminReportDetail />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/services/:id" element={<AdminServiceDetail />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:id" element={<AdminUserDetail />} />
            <Route path="/admin/pets" element={<AdminPets />} />
            <Route path="/admin/pets/:id" element={<AdminPetDetail />} />
          </Route>

          {/* ─── Fallback ─── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
