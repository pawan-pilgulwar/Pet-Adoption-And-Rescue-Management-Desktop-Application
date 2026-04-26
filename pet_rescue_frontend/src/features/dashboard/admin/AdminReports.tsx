import React, { useState, useEffect } from 'react';
import { fetchAllReports, verifyReport } from '../../rescue/api';
import { Report } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Button from '../../../components/common/Button';

function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetchAllReports()
      .then(setReports)
      .catch(() => { })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleVerify(id: number) {
    if (!window.confirm("Verify this report? This action will mark it as Verified and trigger a notification.")) return;
    try {
      await verifyReport(id);
      load();
    } catch {
      alert("Failed to verify report");
    }
  }

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Rescue Reports</h1>
        <p className="text-stone-500">Verify and manage user-submitted pet reports.</p>
      </div>

      <div className="card overflow-x-auto">
        {loading ? <Spinner /> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID / Pet</th>
                <th>Type</th>
                <th>Location</th>
                <th>User / Contact</th>
                <th>Verified?</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td>
                    <div className="font-mono text-xs text-stone-400 mb-1">{r.rescue_id}</div>
                    <div className="font-semibold text-stone-900">{r.pet_detail?.name || 'Unknown'} ({r.pet_detail?.species})</div>
                  </td>
                  <td>
                    <span className={`badge ${r.report_type === 'Lost' ? 'badge-red' : 'badge-green'}`}>
                      {r.report_type}
                    </span>
                  </td>
                  <td className="text-sm max-w-[150px] truncate">{r.location}</td>
                  <td>
                    <div className="text-sm">{r.user_detail}</div>
                    <div className="text-xs text-stone-500">{r.user_contact?.email}</div>
                  </td>
                  <td>
                    <span className={`badge ${r.is_verified ? 'badge-blue' : 'badge-yellow'}`}>
                      {r.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    {!r.is_verified ? (
                      <Button variant="outline" size="sm" className="px-2 py-1 text-xs" onClick={() => handleVerify(r.id)}>
                        Verify
                      </Button>
                    ) : (
                      <span className="text-stone-400 text-xs">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminReports;
