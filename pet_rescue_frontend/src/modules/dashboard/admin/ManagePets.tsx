import React, { useEffect, useState } from 'react';
import api from '../../../api/api';
import { Pet } from '../../../types';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import PetCard from '../../adoption/components/PetCard';
import { uploadImage } from '../../../utils/uploadImage';

const ManagePets: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const emptyForm = {
    name: '', species: '', breed: '', color: '', age: '',
    gender: '', size: '', description: '', vaccination_status: '',
    image: null as File | null,
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await api.get('/pets/admin-all-pets/');
      setPets(response.data.data.pets);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (id: number) => {
    if (!window.confirm("Delete this pet?")) return;
    try {
      await api.delete(`/pets/${id}/admin-delete-pet/`);
      setPets(pets.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete pet:', error);
    }
  };

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name, species: pet.species, breed: pet.breed || '',
      color: pet.color || '', age: pet.age?.toString() || '',
      gender: pet.gender || '', size: pet.size || '',
      description: pet.description || '', vaccination_status: pet.vaccination_status || '',
      image: null,
    });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingPet(null);
    setFormData(emptyForm);
    setShowForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target instanceof HTMLInputElement && e.target.type === 'file' && e.target.files?.[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
      return;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterPet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let image_url = editingPet?.image_url || '';
      let image_public_id = editingPet?.image_public_id || '';

      if (formData.image) {
        const uploadResult = await uploadImage(formData.image);
        image_url = uploadResult.url;
        image_public_id = uploadResult.public_id;
      }

      const payload = {
        name: formData.name, species: formData.species, breed: formData.breed,
        color: formData.color, age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender, size: formData.size, description: formData.description,
        vaccination_status: formData.vaccination_status, image_url, image_public_id,
      };

      let response: any;
      if (editingPet) {
        response = await api.put(`/pets/${editingPet.id}/admin-update-pet/`, payload);
        setPets(pets.map(p => p.id === editingPet.id ? response.data.data : p));
      } else {
        response = await api.post('/pets/admin-register-pet/', payload);
        setPets([...pets, response.data.data]);
      }

      setShowForm(false);
      setEditingPet(null);
      setFormData(emptyForm);
    } catch (error) {
      console.error('Failed to save pet:', error);
      alert('Error saving pet.');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage Pets</h1>
          <p className="text-slate-500 text-sm mt-0.5">Register and manage pets for adoption.</p>
        </div>
        <Button onClick={() => editingPet ? handleCancelEdit() : setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add New Pet'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleRegisterPet} className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm mb-6 space-y-4 animate-fade-in">
          <h2 className="text-base font-bold text-slate-800">{editingPet ? 'Edit Pet' : 'Register a Pet for Adoption'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Pet Name" name="name" required value={formData.name} onChange={handleChange} />
            <Input label="Species (Dog, Cat...)" name="species" required value={formData.species} onChange={handleChange} />
            <Input label="Breed" name="breed" value={formData.breed} onChange={handleChange} />
            <Input label="Color" name="color" value={formData.color} onChange={handleChange} />
            <Input label="Age" name="age" value={formData.age} onChange={handleChange} />
            <Input label="Gender" name="gender" value={formData.gender} onChange={handleChange} />
            <Input label="Size" name="size" value={formData.size} onChange={handleChange} />
            <Input label="Vaccination Status" name="vaccination_status" value={formData.vaccination_status} onChange={handleChange} />
            <Input label="Description" name="description" value={formData.description} onChange={handleChange} />
            <Input label="Pet Image" type="file" name="image" onChange={handleChange} />
          </div>
          <Button type="submit">{editingPet ? 'Update Pet' : 'Publish Pet'}</Button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-slate-400 text-sm">Loading pets...</p>
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-orange-100">
          <span className="text-4xl block mb-3">🐕</span>
          <p className="text-slate-500 text-sm font-medium">No pets found in the system.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet}>
              <div className="flex gap-2">
                <Button className="flex-1" variant="secondary" onClick={() => handleEditPet(pet)}>
                  Edit
                </Button>
                <Button className="flex-1" variant="danger" onClick={() => handleDeletePet(pet.id)}>
                  Delete
                </Button>
              </div>
            </PetCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagePets;
