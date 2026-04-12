import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { loginSchema } from '../utils/validation';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = loginSchema.safeParse({ email, password });

    if (!res.success) {
      const validationErrors = res.error.format();
      setError(validationErrors.email? validationErrors.email._errors[0] 
        : validationErrors.password 
        ? validationErrors.password._errors[0] 
        : 'Invalid input'
      );
      setLoading(false);
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-4xl">🐾</span>
          <h1 className="text-3xl font-black text-slate-800 mt-3">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to your PawPal account</p>
        </div>

        {/* Form card */}
        <div className="bg-white p-8 rounded-2xl shadow-md border border-orange-50">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button className="w-full mt-2" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-600 font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
