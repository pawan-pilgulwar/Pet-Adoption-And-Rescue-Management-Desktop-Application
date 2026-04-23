import axios from 'axios';

// Single Axios instance used by the entire frontend.
// withCredentials=true so the browser sends the httpOnly cookies
// (access_token + refresh_token) set by the backend on login.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1',
  withCredentials: true, // required for cookie-based JWT auth
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
