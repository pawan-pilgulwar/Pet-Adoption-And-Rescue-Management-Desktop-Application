import React, { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import { Pet } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { uploadImage } from '../../../utils/cloudinary';

function AdminPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File|null>(null);

  function loadPets() {
    setLoading(true);
    api.get('/pets/all-pets/')
      .then(r => setPets(r.data?.data?.Pets || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadPets(); }, []);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      let url = '', pid = '';
      if (imageFile) {
        const u = await uploadImage(imageFile);
        url = u.url; pid = u.public_id;
      }

      await api.post('/pets/admin-register-pet/', {
         name, species, breed,
         image_url: url || undefined,
         image_public_id: pid || undefined
      });
      loadPets();
      setShowModal(false);
      setName(''); setSpecies(''); setBreed(''); setImageFile(null);
    } catch {
      alert("Registration failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Pet Registry</h1>
          <p className="text-stone-500">Manage global pet registrations.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ Register Pet</Button>
      </div>

      <div className="card overflow-x-auto">
        {loading ? <Spinner /> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Species</th>
                <th>Breed</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {pets.map(p => (
                <tr key={p.id}>
                  <td className="font-mono text-stone-500 text-xs">{p.pet_id}</td>
                  <td>
                    <div className="h-10 w-10 bg-orange-50 rounded-lg overflow-hidden shrink-0">
                      {p.image_url ? <img src={p.image_url} alt="Pet" className="h-full w-full object-cover" /> : <span className="flex items-center justify-center h-full">🐾</span>}
                    </div>
                  </td>
                  <td className="font-semibold text-stone-900">{p.name}</td>
                  <td>{p.species}</td>
                  <td>{p.breed || '-'}</td>
                  <td className="text-stone-500">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full fade-in">
            <h3 className="text-lg font-bold text-stone-900 mb-4">Register new Pet</h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
              <Input label="Species" value={species} onChange={e => setSpecies(e.target.value)} required />
              <Input label="Breed" value={breed} onChange={e => setBreed(e.target.value)} />
              <div>
                 <label className="text-sm font-medium text-stone-700 block mb-1">Photo</label>
                 <input type="file" ref={fileRef} onChange={e => setImageFile(e.target?.files?.[0] || null)} className="text-sm" accept="image/*" />
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" isLoading={saving}>Register</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPets;
