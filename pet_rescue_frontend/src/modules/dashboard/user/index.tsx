import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import UserDashboard from './UserDashboard';
import ShopDashboard from './ShopDashboard';
import Spinner from '../../../components/common/Spinner';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'SHOP_OWNER') return <ShopDashboard />;
  return <UserDashboard />;
};

export default Dashboard;
