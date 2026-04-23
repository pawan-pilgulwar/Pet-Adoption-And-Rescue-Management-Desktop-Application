import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReport } from '../api';
import { uploadImage, deleteImage } from '../../../utils/cloudinary';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

function CreateReport() {
  const navigate = useNavigate();

  // Report fields
  const [reportType, setReportType] = useState<'Lost' | 'Found'>('Lost');
  const [location, setLocation]     = useState('');
  const [description, setDescription] = useState('');

  // Pet fields (goes inside pet_data)
  const [petName, setPetName]     = useState('');
  const [species, setSpecies]     = useState('');
  const [breed, setBreed]         = useState('');
  const [color, setColor]         = useState('');
  const [age, setAge]             = useState('');
  const [gender, setGender]       = useState('');
  const [size, setSize]           = useState('');

  // Image upload
  const [imageFile, setImageFile]   = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!petName || !species || !location) {
      setError('Pet name, species, and location are required.');
      return;
    }

    setLoading(true);
    setError('');

    let imageUrl = '';
    let imagePublicId = '';

    // Step 1: Upload image to Cloudinary (only on submit)
    if (imageFile) {
      try {
        const uploaded = await uploadImage(imageFile);
        imageUrl       = uploaded.url;
        imagePublicId  = uploaded.public_id;
      } catch {
        setError('Image upload failed. Please try again.');
        setLoading(false);
        return;
      }
    }

    // Step 2: Call backend API with nested pet_data
    // POST /api/v1/rescue/reports/
    try {
      await createReport({
        report_type: reportType,
        location,
        description,
        pet_data: {
          name: petName,
          species,
          breed:     breed     || undefined,
          color:     color     || undefined,
          age:       age       ? Number(age) : undefined,
          gender:    gender    || undefined,
          size:      size      || undefined,
          image_url: imageUrl  || undefined,
          image_public_id: imagePublicId || undefined,
        },
      });
      navigate('/dashboard/reports');
    } catch (err: any) {
      // Step 3: If API fails, log orphaned image
      if (imagePublicId) await deleteImage(imagePublicId);
      setError(err?.response?.data?.message || 'Failed to create report.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <div className="mb-6">
        <h1 className="section-heading">🚨 Report a Pet</h1>
        <p className="section-subheading">Fill in the details of the lost or found pet</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Report Type */}
        <div className="card">
          <p className="text-sm font-semibold text-stone-700 mb-3">Report Type</p>
          <div className="flex gap-4">
            {(['Lost', 'Found'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setReportType(type)}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                  reportType === type
                    ? type === 'Lost'
                      ? 'bg-red-500 border-red-500 text-white'
                      : 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-brand-400'
                }`}
              >
                {type === 'Lost' ? '🔴 Lost Pet' : '🟢 Found Pet'}
              </button>
            ))}
          </div>
        </div>

        {/* Pet Information */}
        <div className="card space-y-4">
          <p className="text-sm font-semibold text-stone-700">Pet Information</p>

          <div className="grid grid-cols-2 gap-4">
            <Input id="pet-name" label="Pet Name *" placeholder="Buddy" value={petName} onChange={e => setPetName(e.target.value)} required />
            <Input id="pet-species" label="Species *" placeholder="Dog, Cat..." value={species} onChange={e => setSpecies(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="pet-breed" label="Breed" placeholder="Labrador..." value={breed} onChange={e => setBreed(e.target.value)} />
            <Input id="pet-color" label="Color" placeholder="Brown, Black..." value={color} onChange={e => setColor(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input id="pet-age" label="Age (years)" type="number" placeholder="2" value={age} onChange={e => setAge(e.target.value)} />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-stone-700">Gender</label>
              <select id="pet-gender" className="input-field" value={gender} onChange={e => setGender(e.target.value)}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-stone-700">Size</label>
              <select id="pet-size" className="input-field" value={size} onChange={e => setSize(e.target.value)}>
                <option value="">Select</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <p className="text-sm font-medium text-stone-700 mb-2">Pet Photo</p>
            <div
              className="border-2 border-dashed border-stone-200 rounded-xl p-6 text-center cursor-pointer hover:border-brand-400 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-40 object-contain mx-auto rounded-lg" />
              ) : (
                <>
                  <span className="text-3xl">📷</span>
                  <p className="text-stone-400 text-sm mt-2">Click to upload a photo</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        </div>

        {/* Report Details */}
        <div className="card space-y-4">
          <p className="text-sm font-semibold text-stone-700">Report Details</p>
          <Input id="report-location" label="Location *" placeholder="Street, City, Area..." value={location} onChange={e => setLocation(e.target.value)} required />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-stone-700">Description</label>
            <textarea
              id="report-description"
              className="input-field resize-none"
              rows={3}
              placeholder="Any additional details about where/when you saw the pet..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" isLoading={loading} className="flex-1 justify-center">
            Submit Report
          </Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/dashboard/reports')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateReport;
