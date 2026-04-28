import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyReports } from '../../rescue/api';
import { Report } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import SearchBar from '../../../components/common/SearchBar';
import ReportCard from '../../rescue/components/ReportCard';

function MyReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMyReports()
      .then(data => setReports(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredReports = reports.filter(r => 
    r.pet_detail?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.report_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">My Reports</h1>
          <p className="text-stone-500">Manage the pets you have reported as lost or found.</p>
        </div>
        <Link to="/dashboard/reports/new" className="btn-primary">+ New Report</Link>
      </div>

      <SearchBar 
        value={searchTerm} 
        onChange={setSearchTerm} 
        placeholder="Search reports by pet name, location or type..." 
      />

      {loading ? (
        <Spinner />
      ) : filteredReports.length === 0 ? (
        <div className="card">
          <Empty message={searchTerm ? "No reports match your search." : "You haven't submitted any reports yet."} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredReports.map(report => (
            <ReportCard key={report.id} report={report} dashboard />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReports;
