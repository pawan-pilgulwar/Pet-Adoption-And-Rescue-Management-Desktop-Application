import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Report } from '../types';
import ReportCard from '../components/ReportCard';

const RescuePage: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSpecies, setSearchSpecies] = useState('');
  const [searchBreed, setSearchBreed] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/rescue/reports/', { params });
      setReports(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch reports', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params: any = {};
    if (searchSpecies) params.species = searchSpecies;
    if (searchBreed) params.breed = searchBreed;
    if (searchLocation) params.location = searchLocation;

    api.get('/rescue/reports/search/', { params })
      .then(res => setReports(res.data.data || []))
      .catch(err => console.error('Search failed', err));
  };

  const handleClear = () => {
    setSearchSpecies('');
    setSearchBreed('');
    setSearchLocation('');
    setFilterType('');
    fetchReports();
  };

  const filteredReports = filterType
    ? reports.filter(r => r.report_type === filterType)
    : reports;

  return (
    <div className="paw-bg min-h-screen">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-teal-500 to-teal-600 py-14 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 text-9xl flex items-center justify-end pr-20 pointer-events-none">🔍</div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-teal-100 text-xs font-semibold uppercase tracking-wider">Community Reports</span>
            <h1 className="text-3xl md:text-4xl font-black text-white mt-1 mb-2">Lost & Found Pets</h1>
            <p className="text-teal-100 text-sm max-w-md">
              Help reunite lost pets with their families. Browse reports or file your own.
            </p>
          </div>
          {user && user.role !== 'ADMIN' && (
            <Link
              to="/create-report"
              className="px-5 py-2.5 bg-white text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-all text-sm shadow-md flex-shrink-0"
            >
              + Report a Pet
            </Link>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-sm mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <input
              type="text"
              placeholder="Species"
              value={searchSpecies}
              onChange={(e) => setSearchSpecies(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-slate-50"
            />
            <input
              type="text"
              placeholder="Breed"
              value={searchBreed}
              onChange={(e) => setSearchBreed(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-slate-50"
            />
            <input
              type="text"
              placeholder="Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-slate-50"
            />
            <div className="flex gap-2">
              <button onClick={handleSearch} className="flex-1 px-4 py-2.5 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors text-sm">
                Search
              </button>
              <button onClick={handleClear} className="px-4 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm">
                Clear
              </button>
            </div>
          </div>

          {/* Type filter pills */}
          <div className="flex gap-2 flex-wrap">
            {['', 'Lost', 'Found'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filterType === type
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-600'
                }`}
              >
                {type === '' ? 'All Reports' : type === 'Lost' ? '🔍 Lost' : '✅ Found'}
              </button>
            ))}
            {!loading && (
              <span className="ml-auto text-xs text-slate-400 font-medium self-center">
                {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Reports Grid */}
        {loading ? (
          <div className="text-center py-20">
            <span className="text-4xl animate-float inline-block">🔍</span>
            <p className="mt-4 text-slate-500 font-medium">Loading reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-orange-100">
            <span className="text-5xl block mb-4">📋</span>
            <p className="text-slate-500 font-medium">No rescue reports found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RescuePage;
