import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import { uploadImage } from '../utils/uploadImage';


const CreateReport: React.FC = () => {
  const [formData, setFormData] = useState({
    pet_name: '',
    species: '',
    pet_breed: '',
    pet_color: '',
    pet_age: '',
    pet_gender: '',
    pet_size: '',
    report_type: 'Lost',
    location: '',
    description: '',
    pet_image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.target instanceof HTMLInputElement && e.target.type === 'file' && e.target.files?.[0]) {
      setFormData({ ...formData, pet_image: e.target.files[0] });
      return;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let image_url = '';
      let image_public_id = '';

      if (formData.pet_image) {
        const uploadResult = await uploadImage(formData.pet_image);
        image_url = uploadResult.url;
        image_public_id = uploadResult.public_id;
      }

      const payload = {
        report_type: formData.report_type,
        location: formData.location,
        description: formData.description,
        pet_data: {
          name: formData.pet_name,
          species: formData.species,
          breed: formData.pet_breed,
          color: formData.pet_color,
          age: formData.pet_age ? parseInt(formData.pet_age) : null,
          gender: formData.pet_gender,
          size: formData.pet_size,
          image_url,
          image_public_id,
        }
      };

      await api.post('/reports/create-report/', payload);

      navigate('/dashboard');

    } catch (err: any) {
      console.error(err);
      setError('Failed to submit report. Please check your data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-slate-800 mb-2">
        📢 File a <span className="text-orange-500">Rescue Report</span>
      </h1>
      <p className="text-slate-500 mb-6">Report a lost or found pet to help them get home safely.</p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-orange-50 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Pet Name" name="pet_name" required value={formData.pet_name} onChange={handleChange} />
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-bold text-slate-700">Report Type</label>
            <select
              name="report_type"
              className="px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              value={formData.report_type}
              onChange={handleChange}
            >
              <option value="Lost">🔍 Lost</option>
              <option value="Found">✅ Found</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Species" placeholder="Dog, Cat, etc." name="species" required value={formData.species} onChange={handleChange} />
          <Input label="Breed" name="pet_breed" placeholder="Optional" value={formData.pet_breed} onChange={handleChange} />
          <Input label="Color" name="pet_color" placeholder="Optional" value={formData.pet_color} onChange={handleChange} />
          <Input label="Age" type="number" name="pet_age" placeholder="Optional" value={formData.pet_age} onChange={handleChange} />
          <Input label="Gender" name="pet_gender" placeholder="Optional" value={formData.pet_gender} onChange={handleChange} />
          <Input label="Size" name="pet_size" placeholder="Optional" value={formData.pet_size} onChange={handleChange} />
          <Input label="Location" name="location" placeholder="Last seen / found location" required value={formData.location} onChange={handleChange} />
        </div>

        <div className="flex flex-col">
          <label className="mb-1.5 text-sm font-bold text-slate-700">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm resize-none"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide any additional details about the pet..."
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1.5 text-sm font-bold text-slate-700">Pet Image</label>
          <input
            type="file"
            name="pet_image"
            accept="image/*"
            onChange={handleChange}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateReport;
