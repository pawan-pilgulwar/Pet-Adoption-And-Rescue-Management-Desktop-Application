import React, { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import { Pet } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { uploadImage } from '../../../utils/cloudinary';
import { petSchema } from '../../../utils/validation';
import { z } from 'zod';

function ShopPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    size: '',
    color: '',
    vaccination_status: '',
    description: '',
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadPets = () => {
    setLoading(true);
    api.get('/pets/all-pets/')
      .then(res => {
        const allPets = res.data?.data?.Pets || [];
        setPets(allPets);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPets();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    try {
      // Validate
      petSchema.parse(form);

      setSaving(true);
      let url = '', pid = '';
      if (imageFile) {
        const u = await uploadImage(imageFile);
        url = u.url; pid = u.public_id;
      }

      await api.post('/pets/admin-register-pet/', {
        ...form,
        image_url: url || undefined,
        image_public_id: pid || undefined
      });

      loadPets();
      setShowModal(false);
      setForm({
        name: '', species: '', breed: '', age: '', gender: '', size: '', color: '', vaccination_status: '', description: ''
      });
      setImageFile(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach(e => {
          if (e.path[0]) fieldErrors[e.path[0].toString()] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        alert("Registration failed. Please check your permissions.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">My Pets</h1>
          <p className="text-stone-500">Manage pets registered under your shop.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ Register Pet</Button>
      </div>

      <div className={`${showModal ? 'blur-sm opacity-50 pointer-events-none' : ''}`}>
        {loading ? (
          <Spinner />
        ) : pets.length === 0 ? (
          <div className="card">
            <Empty message="No pets found." emoji="🐾" />
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Species/Breed</th>
                  <th>Age/Gender</th>
                  <th>ID</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {pets.map(pet => (
                  <tr key={pet.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-orange-50 shrink-0">
                          {pet.image_url ? (
                            <img src={pet.image_url} alt={pet.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="flex items-center justify-center h-full text-xl">🐾</span>
                          )}
                        </div>
                        <span className="font-semibold text-stone-900">{pet.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-stone-900">{pet.species}</span>
                      <br />
                      <span className="text-xs text-stone-500">{pet.breed || '-'}</span>
                    </td>
                    <td>
                      <span className="text-stone-700">{pet.gender || '-'}</span>
                      <br />
                      <span className="text-xs text-stone-500">{pet.age ? `${pet.age} yrs` : '-'}</span>
                    </td>
                    <td className="font-mono text-xs text-stone-400">#{pet.pet_id}</td>
                    <td className="text-stone-500 text-sm">
                      {new Date(pet.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Register Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen px-4 overflow-y-auto pt-10 pb-10">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-stone-900">Register New Pet</h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Pet Name" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
                <Input label="Species" name="species" value={form.species} onChange={handleChange} error={errors.species} placeholder="Dog, Cat, etc." required />
                <Input label="Breed" name="breed" value={form.breed} onChange={handleChange} error={errors.breed} placeholder="Labrador, Persian, etc." />
                <Input label="Age (Years)" name="age" type="number" value={form.age} onChange={handleChange} error={errors.age} />

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-stone-700">Gender</label>
                  <select name="gender" className="input-field" value={form.gender} onChange={handleChange} >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-stone-700">Size</label>
                  <select name="size" className="input-field" value={form.size} onChange={handleChange} >
                    <option value="">Select Size</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>

                <Input label="Color" name="color" value={form.color} onChange={handleChange} error={errors.color} />
                <Input label="Vaccination Status" name="vaccination_status" value={form.vaccination_status} onChange={handleChange} error={errors.vaccination_status} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-stone-700">Description</label>
                <textarea name="description" className="input-field resize-none" rows={3} value={form.description} onChange={handleChange} placeholder="About the pet..." />
              </div>

              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">Photo</label>
                <input type="file" ref={fileRef} onChange={e => setImageFile(e.target?.files?.[0] || null)} className="text-sm" accept="image/*" />
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" isLoading={saving}>Register Pet</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopPets;
