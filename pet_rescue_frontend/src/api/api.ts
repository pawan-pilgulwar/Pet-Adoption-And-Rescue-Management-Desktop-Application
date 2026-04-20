import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const imgUrl = (url?: string | null, fallback = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80') => {
  if (!url) return fallback;
  if (url.startsWith('http')) return url;
  return `http://localhost:8000${url}`;
};

export const uploadToCloudinary = async (file: File): Promise<{ url: string; public_id: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET || '');
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  const data = await res.json();
  return { url: data.secure_url, public_id: data.public_id };
};

export default api;
