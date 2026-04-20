import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import { Report } from '../../../types';
import ReportCard from '../components/ReportCard';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import { useAuth } from '../../../context/AuthContext';

const Rescue: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [location, setLocation] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchReports = async (params?: any) => {
    setLoading(true);
    try {
      const r = await api.get('/rescue/reports/search/', { params });
      setReports(r.data.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchReports(); }, []);

  const search = () => {
    const p: any = {};
    if (species) p.species = species;
    if (breed) p.breed = breed;
    if (location) p.location = location;
    fetchReports(p);
  };

  const clear = () => { setSpecies(''); setBreed(''); setLocation(''); setTypeFilter(''); fetchReports(); };

  const filtered = typeFilter ? reports.filter(r => r.report_type === typeFilter) : reports;
  const inputCls = "px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-stone-50";

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="bg-gradient-to-br from-teal-500 to-teal-600 py-14 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-teal-100 text-xs font-semibold uppercase tracking-wider">Community Reports</span>
            <h1 className="text-3xl md:text-4xl font-black text-white mt-1 mb-2">Lost & Found Pets</h1>
            <p className="text-teal-100 text-sm max-w-md">Help reunite lost pets with their families.</p>
          </div>
          {user && user.role !== 'ADMIN' && (
            <Link to="/dashboard/reports/new" className="px-5 py-2.5 bg-white text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-colors text-sm shadow-md flex-shrink-0">
              + Report a Pet
            </Link>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
            <input className={inputCls} placeholder="Species" value={species} onChange={e => setSpecies(e.target.value)} />
            <input className={inputCls} placeholder="Breed" value={breed} onChange={e => setBreed(e.target.value)} />
            <input className={inputCls} placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={search} className="flex-1 py-2.5 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors text-sm">Search</button>
              <button onClick={clear} className="px-4 py-2.5 bg-stone-100 text-stone-600 font-semibold rounded-xl hover:bg-stone-200 transition-colors text-sm">Clear</button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['', 'Lost', 'Found'].map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${typeFilter === t ? 'bg-teal-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-teal-50 hover:text-teal-600'}`}>
                {t === '' ? 'All' : t === 'Lost' ? '🔍 Lost' : '✅ Found'}
              </button>
            ))}
            {!loading && <span className="ml-auto text-xs text-stone-400 self-center">{filtered.length} report{filtered.length !== 1 ? 's' : ''}</span>}
          </div>
        </div>

        {loading ? <Spinner /> : filtered.length === 0 ? (
          <Empty icon="📋" text="No rescue reports found." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(r => <ReportCard key={r.id} report={r} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rescue;
