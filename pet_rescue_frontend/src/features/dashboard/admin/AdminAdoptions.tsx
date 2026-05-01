import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdoptions } from '../../adoption/api';
import { Adoption } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

function AdminAdoptions() {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdoptions()
      .then(data => setAdoptions(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Adoption Records</h1>
        <p className="text-stone-500">Review all pet adoptions completed on the platform.</p>
      </div>

      {loading ? (
        <Spinner />
      ) : adoptions.length === 0 ? (
        <div className="card">
          <Empty message="No adoptions recorded yet." />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Adoption ID</th>
                <th>Pet</th>
                <th>Adopter</th>
                <th>Shop Owner</th>
                <th>Price</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adoptions.map(adoption => (
                <tr key={adoption.id}>
                  <td className="font-mono text-xs text-stone-500">#{adoption.id}</td>
                  <td className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-orange-50 shrink-0">
                      {adoption.pet_detail?.image_url ? (
                        <img src={adoption.pet_detail.image_url} alt="Pet" className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex items-center justify-center h-full w-full text-lg">🐾</span>
                      )}
                    </div>
                    <div>
                        <p className="font-semibold text-stone-900">{adoption.pet_detail?.name}</p>
                        <p className="text-xs text-stone-500">{adoption.pet_detail?.species} • {adoption.pet_detail?.breed || 'Unknown'}</p>
                    </div>
                  </td>
                  <td>
                    <p className="text-sm font-medium text-stone-900">{adoption.user_detail}</p>
                  </td>
                  <td>
                    <p className="text-sm text-stone-600">{adoption.shop_name || adoption.shop_detail || '-'}</p>
                  </td>
                  <td className="font-semibold text-brand-500">₹{adoption.price}</td>
                  <td className="text-stone-500 text-sm">{new Date(adoption.adopted_at || '').toLocaleDateString()}</td>
                  <td className="text-right">
                    <Link 
                      to={`/admin/adoptions/${adoption.id}`}
                      className="text-brand-500 hover:text-brand-600 font-bold text-xs uppercase tracking-wider"
                    >
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminAdoptions;
