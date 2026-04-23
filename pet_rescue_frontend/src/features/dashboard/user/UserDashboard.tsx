import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DashboardCard from '../../../components/common/DashboardCard';
import { fetchMyReports } from '../../rescue/api';
import { fetchAdoptions } from '../../adoption/api';
import { fetchMyRescueRequests } from '../../rescue/api';

function UserDashboard() {
  const { user } = useAuth();
  const [reportCount, setReportCount] = useState(0);
  const [adoptionCount, setAdoptionCount] = useState(0);
  const [rescueReqCount, setRescueReqCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchMyReports().catch(() => []),
      fetchAdoptions().catch(() => []),
      fetchMyRescueRequests().catch(() => []),
    ]).then(([reports, adoptions, rescueReqs]) => {
      setReportCount(reports.length);
      setAdoptionCount(adoptions.length);
      setRescueReqCount(rescueReqs.length);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Welcome, {user?.first_name}! 👋</h1>
        <p className="text-stone-500">Here's a quick overview of your activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard 
          title="My Reports" 
          value={loading ? '-' : reportCount} 
          icon="📄" 
          color="bg-blue-100" 
          textColor="text-blue-600" 
        />
        <DashboardCard 
          title="My Adoptions" 
          value={loading ? '-' : adoptionCount} 
          icon="❤️" 
          color="bg-red-100" 
          textColor="text-red-600" 
        />
        <DashboardCard 
          title="Rescue Requests" 
          value={loading ? '-' : rescueReqCount} 
          icon="🆘" 
          color="bg-orange-100" 
          textColor="text-orange-600" 
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-bold text-stone-900 mb-4">Quick Links</h2>
          <div className="space-y-3">
            <Link to="/dashboard/reports/new" className="block p-3 rounded-xl hover:bg-orange-50 text-brand-500 font-medium transition-colors">
              + File a new Rescue Report
            </Link>
            <Link to="/adoption" className="block p-3 rounded-xl hover:bg-orange-50 text-brand-500 font-medium transition-colors">
              🐾 Browse pets for adoption
            </Link>
            <Link to="/services" className="block p-3 rounded-xl hover:bg-orange-50 text-brand-500 font-medium transition-colors">
              🛠️ Book a pet service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
