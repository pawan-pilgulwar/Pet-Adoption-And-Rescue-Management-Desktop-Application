import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { UserRole } from '../../../types';
import { registerSchema } from '../../../utils/validation';
import { z } from 'zod';

// USER registration payload
interface UserPayload {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  address?: string;
  phone_number?: string;
  shop_name?: string;
  shop_address?: string;
  shop_license?: string;
}

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState<'USER' | 'SHOP_OWNER'>('USER');
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    // USER fields
    address: '',
    phone_number: '',
    // SHOP_OWNER fields
    shop_name: '',
    shop_address: '',
    shop_license: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setErrors({});

    try {
      // Validate with Zod
      registerSchema.parse({ ...form, role });

      setLoading(true);
      // Build payload based on role
      // POST /api/v1/users/register/
      const payload: UserPayload = {
        first_name: form.first_name,
        last_name: form.last_name,
        username: form.username,
        email: form.email,
        password: form.password,
        role,
      };

      if (role === 'USER') {
        payload.address = form.address;
        payload.phone_number = form.phone_number;
      } else {
        payload.shop_name = form.shop_name;
        payload.shop_address = form.shop_address;
        payload.shop_license = form.shop_license;
        payload.phone_number = form.phone_number;
      }

      await api.post('/users/register/', payload);
      navigate('/login');
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach(e => {
          if (e.path[0]) fieldErrors[e.path[0].toString()] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        const data = err?.response?.data;
        const msg = data?.message || data?.detail || JSON.stringify(data) || 'Registration failed.';
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="card fade-in-up">
          {/* Header */}
          <div className="text-center mb-6">
            <span className="text-5xl">🐾</span>
            <h1 className="text-2xl font-bold text-stone-900 mt-3">Create Account</h1>
            <p className="text-stone-500 text-sm">Join PetRescue and make a difference</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-stone-100 rounded-xl p-1 mb-6">
            {(['USER', 'SHOP_OWNER'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${role === r ? 'bg-brand-500 text-white shadow' : 'text-stone-600 hover:text-brand-500'
                  }`}
              >
                {r === 'USER' ? '👤 Pet Owner' : '🏪 Shop Owner'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input id="first_name" label="First Name" name="first_name" placeholder="John"
                value={form.first_name} onChange={handleChange} error={errors.first_name} />
              <Input id="last_name" label="Last Name" name="last_name" placeholder="Doe"
                value={form.last_name} onChange={handleChange} error={errors.last_name} />
            </div>

            <Input id="reg-username" label="Username (min 5 chars)" name="username" placeholder="johndoe"
              value={form.username} onChange={handleChange} error={errors.username} />

            <Input id="reg-email" label="Email" type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} error={errors.email} />

            <Input id="reg-password" label="Password (min 8 chars)" type="password" name="password" placeholder="••••••••"
              value={form.password} onChange={handleChange} error={errors.password} />

            {/* Role-specific fields */}
            {role === 'USER' ? (
              <>
                <Input id="address" label="Address" name="address" placeholder="123 Main St, City"
                  value={form.address} onChange={handleChange} error={errors.address} />
                <Input id="phone_number" label="Phone Number" name="phone_number" placeholder="1234567890"
                  value={form.phone_number} onChange={handleChange} error={errors.phone_number} />
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input id="shop_name" label="Shop Name" name="shop_name" placeholder="Happy Paws"
                    value={form.shop_name} onChange={handleChange} error={errors.shop_name} />
                  <Input id="phone_number_shop" label="Shop Phone" name="phone_number" placeholder="1234567890"
                    value={form.phone_number} onChange={handleChange} error={errors.phone_number} />
                </div>
                <Input id="shop_address" label="Shop Address" name="shop_address" placeholder="456 Pet Lane"
                  value={form.shop_address} onChange={handleChange} error={errors.shop_address} />
                <Input id="shop_license" label="License Number" name="shop_license" placeholder="LIC-XXXXX"
                  value={form.shop_license} onChange={handleChange} error={errors.shop_license} />
              </>
            )}

            <Button type="submit" className="w-full justify-center mt-2" isLoading={loading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
