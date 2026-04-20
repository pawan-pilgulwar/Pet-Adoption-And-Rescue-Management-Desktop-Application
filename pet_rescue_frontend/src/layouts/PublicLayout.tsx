import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PublicLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-stone-50">
    <Navbar />
    <main className="flex-1"><Outlet /></main>
    <Footer />
  </div>
);

export default PublicLayout;
