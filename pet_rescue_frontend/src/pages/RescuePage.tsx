import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PetReport } from '../types';
import ReportCard from '../components/ReportCard';

const RescuePage: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<PetReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSpecies, setSearchSpecies] = useState('');
  const [searchBreed, setSearchBreed] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchColor, setSearchColor] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports/all-reports/');
      setReports(res.data.data.Reports || []);
    } catch (error) {
      console.error('Failed to fetch reports', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchSpecies) params.append('species', searchSpecies);
      if (searchBreed) params.append('breed', searchBreed);
      if (searchLocation) params.append('location', searchLocation);
      if (searchColor) params.append('color', searchColor);

      const res = await api.get(`/reports/search/?${params.toString()}`);
      setReports(res.data.data.Reports || []);
    } catch (error) {
      console.error('Failed to search reports', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchSpecies('');
    setSearchBreed('');
    setSearchLocation('');
    setSearchColor('');
    fetchReports();
  };

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-teal-500 to-teal-600 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-black text-white">
              🔍 Lost & Found Pets
            </h1>
            {user && user.role !== 'Admin' ? (
              <Link
                to="/create-report"
                className="px-4 py-2 text-sm font-bold rounded-xl bg-white text-teal-600 hover:bg-teal-100"
              >
                ➕ Report Pet
              </Link>
            ) : null}
          </div>
          <p className="text-white/80 max-w-lg mx-auto">
            Browse community rescue reports. Help reunite lost pets with their loving families.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Filters */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-50 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Species"
              value={searchSpecies}
              onChange={(e) => setSearchSpecies(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <input
              type="text"
              placeholder="Breed"
              value={searchBreed}
              onChange={(e) => setSearchBreed(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <input
              type="text"
              placeholder="Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <input
              type="text"
              placeholder="Color"
              value={searchColor}
              onChange={(e) => setSearchColor(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 px-4 py-2.5 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-600 transition-colors text-sm"
              >
                Search
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        {loading ? (
          <div className="text-center py-16">
            <span className="text-4xl animate-float inline-block">🔍</span>
            <p className="mt-4 text-slate-500 font-bold">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-orange-50">
            <span className="text-4xl">📋</span>
            <p className="mt-4 text-slate-500 font-bold">No rescue reports found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RescuePage;
