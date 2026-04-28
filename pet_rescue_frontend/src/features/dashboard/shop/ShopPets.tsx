import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import { Pet } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import Empty from '../../../components/common/Empty';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import SearchBar from '../../../components/common/SearchBar';
import { uploadImage } from '../../../utils/cloudinary';
import { petSchema } from '../../../utils/validation';
import { z } from 'zod';

function ShopPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialForm = {
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    size: '',
    color: '',
    vaccination_status: '',
    description: '',
  };

  const [form, setForm] = useState(initialForm);

  const fileRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  const loadPets = () => {
    setLoading(true);
    api.get('/pets/all-pets/?my_pets=true')
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

  const resetForm = () => {
    setForm(initialForm);
    setImageFile(null);
    setExistingImageUrl('');
    if (fileRef.current) fileRef.current.value = '';
    setErrors({});
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (pet: Pet) => {
    setForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed || '',
      age: pet.age?.toString() || '',
      gender: pet.gender || '',
      size: pet.size || '',
      color: pet.color || '',
      vaccination_status: pet.vaccination_status || '',
      description: pet.description || '',
    });
    setExistingImageUrl(pet.image_url || '');
    setIsEditing(true);
    setEditingId(pet.id);
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;
    try {
      await api.delete(`/pets/${id}/admin-delete-pet/`);
      loadPets();
    } catch {
      alert("Failed to delete pet");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    try {
      // Validate
      petSchema.parse(form);

      setSaving(true);
      let url = existingImageUrl, pid = '';
      if (imageFile) {
        const u = await uploadImage(imageFile);
        url = u.url; pid = u.public_id;
      }

      const payload = {
        ...form,
        image_url: url || undefined,
        image_public_id: pid || undefined
      };

      if (isEditing && editingId) {
        await api.patch(`/pets/${editingId}/admin-update-pet/`, payload);
      } else {
        await api.post('/pets/admin-register-pet/', payload);
      }

      loadPets();
      setShowModal(false);
      resetForm();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach(e => {
          if (e.path[0]) fieldErrors[e.path[0].toString()] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        alert(`${isEditing ? 'Update' : 'Registration'} failed. Please check your permissions.`);
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
        <Button onClick={() => { resetForm(); setShowModal(true); }}>+ Register Pet</Button>
      </div>

      <div className={`${showModal ? 'blur-sm opacity-50 pointer-events-none' : ''}`}>
        <SearchBar 
          value={searchTerm} 
          onChange={setSearchTerm} 
          placeholder="Search by name, species or breed..." 
        />

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
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pets
                  .filter(p => 
                    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (p.breed && p.breed.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map(pet => (
                  <tr key={pet.id} className="hover:bg-stone-50/50 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-orange-50 shrink-0">
                          {pet.image_url ? (
                            <img src={pet.image_url} alt={pet.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="flex items-center justify-center h-full text-xl">🐾</span>
                          )}
                        </div>
                        <Link to={`/dashboard/pets/${pet.id}`} className="font-semibold text-stone-900 hover:text-brand-500">
                          {pet.name}
                        </Link>
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
                    <td className="text-right">
                       <div className="flex justify-end gap-2">
                         <Button variant="ghost" size="sm" className="text-stone-600" onClick={() => handleEdit(pet)}>Edit</Button>
                         <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(pet.id)}>Delete</Button>
                       </div>
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
              <h3 className="text-xl font-bold text-stone-900">{isEditing ? 'Edit Pet' : 'Register New Pet'}</h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                {existingImageUrl && !imageFile && (
                  <div className="mb-2 relative w-20 h-20 rounded-lg overflow-hidden border border-stone-200">
                    <img src={existingImageUrl} alt="Current" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setExistingImageUrl('')}
                      className="absolute top-0 right-0 bg-red-500 text-white p-0.5 text-[10px]"
                    >✕</button>
                  </div>
                )}
                <input type="file" ref={fileRef} onChange={e => setImageFile(e.target?.files?.[0] || null)} className="text-sm" accept="image/*" />
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" isLoading={saving}>{isEditing ? 'Update Pet' : 'Register Pet'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopPets;
