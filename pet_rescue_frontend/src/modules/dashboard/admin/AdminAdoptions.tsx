import React, { useEffect, useState } from 'react';
import api from '../../../api/api';
import { Adoption } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';

const AdminAdoptions: React.FC = () => {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/adoption/adoptions/').then(r => setAdoptions(r.data.data || r.data.results || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-stone-900">Adoptions</h1>
        <p className="text-stone-500 text-sm mt-0.5">All completed adoption records</p>
      </div>
      {loading ? <Spinner /> : adoptions.length === 0 ? <Empty icon="🏠" text="No adoptions yet." /> : (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="px-5 py-3 border-b border-stone-100">Pet</th>
                  <th className="px-5 py-3 border-b border-stone-100">Adopter</th>
                  <th className="px-5 py-3 border-b border-stone-100 hidden md:table-cell">Shop</th>
                  <th className="px-5 py-3 border-b border-stone-100">Price</th>
                  <th className="px-5 py-3 border-b border-stone-100">Status</th>
                </tr>
              </thead>
              <tbody>
                {adoptions.map(a => (
                  <tr key={a.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-stone-900 text-sm">{a.pet_detail?.name}</p>
                      <p className="text-xs text-stone-400">{a.pet_detail?.species}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-stone-600">{a.user_detail}</td>
                    <td className="px-5 py-3.5 text-sm text-stone-600 hidden md:table-cell">{a.shop_detail}</td>
                    <td className="px-5 py-3.5 font-semibold text-brand-500">${a.price}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${a.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-500'}`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdoptions;
