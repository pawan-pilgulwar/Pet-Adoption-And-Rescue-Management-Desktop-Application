import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchReports, searchReports } from '../api';
import { Report } from '../../../types';
import ReportCard from '../components/ReportCard';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { useAuth } from '../../../context/AuthContext';

function RescuePage() {
  const { user } = useAuth();
  const [reports, setReports]   = useState<Report[]>([]);
  const [loading, setLoading]   = useState(true);
  const [species, setSpecies]   = useState('');
  const [breed, setBreed]       = useState('');
  const [location, setLocation] = useState('');

  function loadReports() {
    setLoading(true);
    fetchReports()
      .then(data => setReports(data))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadReports(); }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await searchReports({
        species:  species  || undefined,
        breed:    breed    || undefined,
        location: location || undefined,
      } as any);
      setReports(data);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setSpecies(''); setBreed(''); setLocation('');
    loadReports();
  }

  const lostCount  = reports.filter(r => r.report_type === 'Lost').length;
  const foundCount = reports.filter(r => r.report_type === 'Found').length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">🚨 Rescue Center</h1>
          <p className="text-stone-500 mt-1">Search verified lost & found pet reports</p>
        </div>
        {user && (
          <Link to="/dashboard/reports/new" className="btn-primary">
            + Report a Pet
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-2xl font-bold text-red-500">{lostCount}</p>
          <p className="text-stone-500 text-sm">Lost Pets</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-500">{foundCount}</p>
          <p className="text-stone-500 text-sm">Found Pets</p>
        </div>
        <div className="card text-center col-span-2 md:col-span-1">
          <p className="text-2xl font-bold text-brand-500">{reports.length}</p>
          <p className="text-stone-500 text-sm">Total Reports</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="card mb-8 flex flex-col sm:flex-row gap-4 items-end">
        <Input id="rescue-species" label="Species" placeholder="Dog, Cat..." value={species} onChange={e => setSpecies(e.target.value)} className="flex-1" />
        <Input id="rescue-breed"   label="Breed"   placeholder="Labrador..."  value={breed}   onChange={e => setBreed(e.target.value)}   className="flex-1" />
        <Input id="rescue-loc"     label="Location" placeholder="City / Area" value={location} onChange={e => setLocation(e.target.value)} className="flex-1" />
        <div className="flex gap-2">
          <Button type="submit">🔍 Search</Button>
          <Button type="button" variant="ghost" onClick={handleClear}>Clear</Button>
        </div>
      </form>

      {/* Report List */}
      {loading ? (
        <Spinner message="Loading reports..." />
      ) : reports.length === 0 ? (
        <Empty message="No verified reports found." emoji="🐾" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reports.map(report => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}

export default RescuePage;
