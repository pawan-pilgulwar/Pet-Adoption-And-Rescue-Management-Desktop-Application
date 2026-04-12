import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import { registerSchema } from '../utils/validation';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    confirm_password: '',
    phone_number: '',
    address: '',
    profile_picture: null as File | null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture' && files && files[0]) {
      setFormData({ ...formData, profile_picture: files[0] });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = registerSchema.safeParse(formData);

      if(!result.success) {
        const errors = result.error.format();
        setValidationErrors(errors);
        setError('Please fix the validation errors above.');
        return;
      }

      const fm = new FormData();
      fm.append('username', formData.username);
      fm.append('email', formData.email);
      fm.append('first_name', formData.first_name);
      fm.append('last_name', formData.last_name);
      fm.append('password', formData.password);
      fm.append('phone_number', formData.phone_number);
      fm.append('address', formData.address);
      if (formData.profile_picture) {
        fm.append('profile_picture', formData.profile_picture);
      }

      await api.post('/users/register/', fm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

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
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-teal-50 p-8 border border-teal-200 rounded-2xl text-center shadow-sm">
          <span className="text-4xl">✅</span>
          <h2 className="text-2xl font-black text-teal-700 mt-3 mb-2">Registration Successful!</h2>
          <p className="text-teal-600">You will be redirected to the login page shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-4xl">🐾</span>
          <h1 className="text-3xl font-black text-slate-800 mt-3">Create an Account</h1>
          <p className="text-slate-500 mt-2">Join the PawPal community today</p>
        </div>

        {/* Form card */}
        <div className="bg-white p-8 rounded-2xl shadow-md border border-orange-50">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" name="first_name" required value={formData.first_name} onChange={handleChange} />
              {validationErrors.first_name && (<p className="text-red-500 text-sm">{validationErrors.first_name._errors[0]}</p>)}
              <Input label="Last Name" name="last_name" required value={formData.last_name} onChange={handleChange} />
              {validationErrors.last_name && (<p className="text-red-500 text-sm">{validationErrors.last_name._errors[0]}</p>)}
            </div>
            <Input label="Username" name="username" required value={formData.username} onChange={handleChange} />
            {validationErrors.email && (<p className="text-red-500 text-sm">{validationErrors.email._errors[0]}</p>)}
            <Input label="Email Address" type="email" name="email" required value={formData.email} onChange={handleChange} />
            {validationErrors.email && (<p className="text-red-500 text-sm">{validationErrors.email._errors[0]}</p>)}
            <Input label="Phone Number" name="phone_number" required value={formData.phone_number} onChange={handleChange} />
            <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
            <Input label="Profile Picture" type="file" name="profile_picture" onChange={handleChange} />
            <Input label="Password" type="password" name="password" required value={formData.password} onChange={handleChange} />
            {validationErrors.password && (<p className="text-red-500 text-sm">{validationErrors.password._errors[0]}</p>)}
            <Input label="Confirm Password" type="password" name="confirm_password" required value={formData.confirm_password} onChange={handleChange} />
            {validationErrors.confirm_password && (<p className="text-red-500 text-sm">{validationErrors.confirm_password._errors[0]}</p>)}

            <Button className="w-full mt-2" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
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
