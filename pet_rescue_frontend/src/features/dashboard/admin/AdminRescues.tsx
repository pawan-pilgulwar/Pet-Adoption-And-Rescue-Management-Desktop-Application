import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { ChatRoom, ShopOwnerProfile } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

function AdminRescues() {
  const [rescues, setRescues] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/chats/rooms/')
      .then(res => {
        const roomsData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setRescues(roomsData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getDisplayName = (user: any) => {
    if (user.profile && 'shop_name' in user.profile) {
      return (user.profile as ShopOwnerProfile).shop_name;
    }
    return `${user.first_name} ${user.last_name}`;
  };

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Rescue Records</h1>
        <p className="text-stone-500">Overview and audit of all collaborative pet rescue operations.</p>
      </div>

      {loading ? (
        <Spinner message="Loading rescue records..." />
      ) : rescues.length === 0 ? (
        <div className="card">
          <Empty message="No rescue operations recorded yet." />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rescue ID</th>
                <th>Pet</th>
                <th>Finder / Reporter</th>
                <th>Helper / Rescuer</th>
                <th>Status</th>
                <th>Date Initiated</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rescues.map(rescue => {
                const pet = rescue.report.pet;
                return (
                  <tr key={rescue.id}>
                    <td className="font-mono text-xs text-stone-500 font-bold">#{rescue.report.rescue_id}</td>
                    <td className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-orange-50 shrink-0">
                        {pet?.image_url ? (
                          <img src={pet.image_url} alt="Pet" className="h-full w-full object-cover" />
                        ) : (
                          <span className="flex items-center justify-center h-full w-full text-lg bg-stone-50 border border-stone-100 rounded-lg">🐾</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-stone-900">{pet?.name || 'Unknown'}</p>
                        <p className="text-xs text-stone-500">{pet?.species} • {pet?.breed || 'Unknown'}</p>
                      </div>
                    </td>
                    <td>
                      <p className="text-sm font-semibold text-stone-900">{getDisplayName(rescue.reporter)}</p>
                      <p className="text-[10px] text-stone-400">@{rescue.reporter.username} • {rescue.reporter.role}</p>
                    </td>
                    <td>
                      <p className="text-sm font-semibold text-stone-900">{getDisplayName(rescue.rescuer)}</p>
                      <p className="text-[10px] text-stone-400">@{rescue.rescuer.username} • {rescue.rescuer.role}</p>
                    </td>
                    <td>
                      <span className={`badge text-[10px] ${rescue.is_completed ? 'badge-green' : 'badge-yellow'}`}>
                        {rescue.is_completed ? 'Resolved' : 'Active'}
                      </span>
                    </td>
                    <td className="text-stone-500 text-sm">{new Date(rescue.created_at).toLocaleDateString()}</td>
                    <td className="text-right">
                      <Link 
                        to={`/admin/rescues/${rescue.id}`}
                        className="text-brand-500 hover:text-brand-600 font-bold text-xs uppercase tracking-wider"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminRescues;
