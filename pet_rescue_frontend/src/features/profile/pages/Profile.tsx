import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { uploadImage } from '../../../utils/cloudinary';

function Profile() {
  const { user, fetchMe } = useAuth();
  
  // Basic user info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // Profile specific fields
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopLicense, setShopLicense] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Image Upload
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!user) return;
    setFirstName(user.first_name);
    setLastName(user.last_name);
    
    if (user.profile) {
      const p = user.profile as any;
      setAddress(p.address || '');
      setPhone(p.phone_number || '');
      setShopName(p.shop_name || '');
      setShopAddress(p.shop_address || '');
      setShopLicense(p.shop_license || '');
      if (p.profile_picture_url) setImagePreview(p.profile_picture_url);
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(''); setSuccess(false);

    try {
      let url = undefined;
      let pid = undefined;

      if (imageFile) {
        const u = await uploadImage(imageFile);
        url = u.url;
        pid = u.public_id;
      }

      // PATCH /api/v1/users/profile/ (to update profile)
      // Note: Backend might require specific payload depending on serialization
      const payload: any = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
      };

      if (url) {
         payload.profile_picture_url = url;
         payload.profile_picture_public_id = pid;
      }

      if (user?.role === 'USER') {
        payload.address = address;
      } else if (user?.role === 'SHOP_OWNER') {
        payload.shop_name = shopName;
        payload.shop_address = shopAddress;
        payload.shop_license = shopLicense;
      }

      await api.patch('/users/profile/', payload);
      await fetchMe();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
       setError(err?.response?.data?.message || 'Failed to update profile');
    } finally {
       setLoading(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
     const file = e.target.files?.[0];
     if (!file) return;
     setImageFile(file);
     setImagePreview(URL.createObjectURL(file));
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-10 fade-in">
       <div className="mb-8">
         <h1 className="text-3xl font-bold text-stone-900">Profile</h1>
         <p className="text-stone-500">Manage your personal information and settings.</p>
       </div>

       <div className="card">
         <form onSubmit={handleSubmit} className="space-y-6">
           
           <div className="flex items-center gap-6 mb-6">
             <div className="h-24 w-24 rounded-full bg-orange-100 overflow-hidden shrink-0 border-4 border-white shadow-md relative group">
               {imagePreview ? (
                 <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
               ) : (
                 <span className="flex items-center justify-center h-full w-full text-4xl">
                   {user.first_name[0]?.toUpperCase() || '👤'}
                 </span>
               )}
               <button type="button" onClick={() => fileRef.current?.click()} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                 Change
               </button>
             </div>
             <div>
               <h2 className="text-xl font-bold text-stone-900">{user.first_name} {user.last_name}</h2>
               <p className="text-stone-500 text-sm">@{user.username} • {user.email}</p>
               <span className={`badge mt-2 ${user.role === 'ADMIN' ? 'badge-blue' : user.role === 'SHOP_OWNER' ? 'badge-orange' : 'badge-green'}`}>
                 Role: {user.role}
               </span>
               <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleImageChange} />
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required />
              <Input label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required />
           </div>

           <Input label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />

           {user.role === 'USER' && (
             <Input label="Address" value={address} onChange={e => setAddress(e.target.value)} />
           )}

           {user.role === 'SHOP_OWNER' && (
             <>
               <Input label="Shop Name" value={shopName} onChange={e => setShopName(e.target.value)} />
               <Input label="Shop Address" value={shopAddress} onChange={e => setShopAddress(e.target.value)} />
               <Input label="Shop License" value={shopLicense} onChange={e => setShopLicense(e.target.value)} />
             </>
           )}

           {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
           {success && <div className="p-3 bg-green-50 text-green-600 rounded-xl text-sm">Profile updated successfully!</div>}

           <div className="flex justify-end pt-4 border-t border-stone-100">
             <Button type="submit" isLoading={loading}>Save Changes</Button>
           </div>
         </form>
       </div>
    </div>
  );
}

export default Profile;
