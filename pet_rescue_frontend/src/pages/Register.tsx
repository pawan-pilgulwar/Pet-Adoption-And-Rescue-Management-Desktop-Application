import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import { registerSchema } from '../utils/validation';
import { uploadImage } from '../utils/uploadImage';


const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
    phone_number: '',
    role: 'USER',
    address: '',
    shop_name: '',
    shop_address: '',
    shop_license: '',
    profile_picture: null as File | null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'profile_picture') {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        setFormData({ ...formData, profile_picture: files[0] });
        return;
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log("Registering with formData:", { ...formData, password: '***', confirm_password: '***' });
      const result = registerSchema.safeParse(formData);

      if (!result.success) {
        const errors = result.error.format();
        setValidationErrors(errors);
        setError('Please fix the validation errors above.');
        setLoading(false);
        return;
      }

      let profile_picture_url = '';
      let profile_picture_public_id = '';

      if (formData.profile_picture) {
        const uploadResult = await uploadImage(formData.profile_picture);
        profile_picture_url = uploadResult.url;
        profile_picture_public_id = uploadResult.public_id;
      }

      const payload = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
        phone_number: formData.phone_number,
        address: formData.address,
        role: formData.role,
        shop_name: formData.shop_name,
        shop_address: formData.shop_address,
        shop_license: formData.shop_license,
        profile_picture_url,
        profile_picture_public_id,
      };

      await api.post('/users/register/', payload);

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="paw-bg min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-emerald-50 p-8 border border-emerald-200 rounded-2xl text-center shadow-sm">
          <span className="text-4xl">✅</span>
          <h2 className="text-2xl font-black text-emerald-700 mt-3 mb-2">Registration Successful!</h2>
          <p className="text-emerald-600 text-sm">You will be redirected to the login page shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="paw-bg min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-orange-500/20">🐾</div>
          <h1 className="text-2xl font-black text-slate-900">Create an Account</h1>
          <p className="text-slate-500 text-sm mt-1">Join the PawPal community today</p>
        </div>

        {/* Form card */}
        <div className="bg-white p-7 md:p-10 rounded-2xl shadow-sm border border-orange-100">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 animate-in shake">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info Group */}
              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Personal Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Input label="First Name" name="first_name" required value={formData.first_name} onChange={handleChange} />
                    {validationErrors.first_name && (<p className="text-red-500 text-xs">{validationErrors.first_name._errors[0]}</p>)}
                  </div>
                  <div className="space-y-1">
                    <Input label="Last Name" name="last_name" required value={formData.last_name} onChange={handleChange} />
                    {validationErrors.last_name && (<p className="text-red-500 text-xs">{validationErrors.last_name._errors[0]}</p>)}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Input label="Email Address" type="email" name="email" required value={formData.email} onChange={handleChange} />
                  {validationErrors.email && (<p className="text-red-500 text-xs">{validationErrors.email._errors[0]}</p>)}
                </div>

                <div className="space-y-1">
                  <Input label="Username" name="username" required value={formData.username} onChange={handleChange} />
                  {validationErrors.username && (<p className="text-red-500 text-xs">{validationErrors.username._errors[0]}</p>)}
                </div>
              </div>

              {/* Account Security Group */}
              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Account Security</p>
                <div className="space-y-1">
                  <Input label="Password" type="password" name="password" required value={formData.password} onChange={handleChange} />
                  {validationErrors.password && (<p className="text-red-500 text-xs">{validationErrors.password._errors[0]}</p>)}
                </div>
                <div className="space-y-1">
                  <Input label="Confirm Password" type="password" name="confirm_password" required value={formData.confirm_password} onChange={handleChange} />
                  {validationErrors.confirm_password && (<p className="text-red-500 text-xs">{validationErrors.confirm_password._errors[0]}</p>)}
                </div>
                
                <div className="pt-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">I am a...</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all font-medium"
                  >
                    <option value="USER">Pet Owner / Rescuer</option>
                    <option value="SHOP_OWNER">Pet Shop Owner</option>
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Role Specific and Profile Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {formData.role === 'USER' && (
                  <>
                    <p className="text-xs font-black text-teal-600 uppercase tracking-widest mb-2">Contact Details</p>
                    <Input label="Phone Number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                    <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
                  </>
                )}

                {formData.role === 'SHOP_OWNER' && (
                  <div className="space-y-4 p-5 bg-orange-50 rounded-2xl border border-orange-100 animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-2">Shop Information</p>
                    <Input label="Shop Name" name="shop_name" required value={formData.shop_name} onChange={handleChange} />
                    <Input label="Shop Address" name="shop_address" required value={formData.shop_address} onChange={handleChange} />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Phone Number" name="phone_number" required value={formData.phone_number} onChange={handleChange} />
                      <Input label="Shop License" name="shop_license" required value={formData.shop_license} onChange={handleChange} />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Profile Customization</p>
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl hover:border-orange-200 transition-colors">
                  <Input label="Profile Picture" type="file" name="profile_picture" onChange={handleChange} />
                  <p className="text-[10px] text-slate-400 mt-2">Recommended: Square image, max 5MB</p>
                </div>
              </div>
            </div>

            <Button className="w-full md:w-auto md:px-12 py-4 h-auto text-lg mt-4 shadow-lg shadow-orange-200" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
