import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import UserDashboard from '../user/UserDashboard';
import ShopDashboard from '../shop/ShopDashboard';
import AdminDashboard from '../admin/AdminDashboard'; // Optional if admin has its own direct route, but good for completeness

function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'USER':
      return <UserDashboard />;
    case 'SHOP_OWNER':
      return <ShopDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    default:
      return <div>Invalid Role</div>;
  }
}

export default Dashboard;
