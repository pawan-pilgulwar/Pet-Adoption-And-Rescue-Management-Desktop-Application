import React, { useState, useEffect } from 'react';
import { fetchAdoptions } from '../../adoption/api';
import { Adoption } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

function MyAdoptions() {
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
        <h1 className="text-2xl font-bold text-stone-900">My Adoptions</h1>
        <p className="text-stone-500">Pets you have adopted or requested to adopt.</p>
      </div>

      {loading ? (
        <Spinner />
      ) : adoptions.length === 0 ? (
        <div className="card">
          <Empty message="You don't have any adopted pets yet." />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pet</th>
                <th>Shop Owner</th>
                <th>Price</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {adoptions.map(adoption => (
                <tr key={adoption.id}>
                  <td className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-orange-50 shrink-0">
                      {adoption.pet_detail?.image_url ? (
                        <img src={adoption.pet_detail.image_url} alt="Pet" className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex items-center justify-center h-full w-full text-lg">🐾</span>
                      )}
                    </div>
                    <span className="font-semibold text-stone-900">{adoption.pet_detail?.name}</span>
                  </td>
                  <td>{adoption.shop_detail || '-'}</td>
                  <td className="font-semibold text-brand-500">₹{adoption.price}</td>
                  <td>
                    <span className="badge badge-green">{adoption.status}</span>
                  </td>
                  <td className="text-stone-500">{new Date(adoption.adopted_at || '').toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyAdoptions;
