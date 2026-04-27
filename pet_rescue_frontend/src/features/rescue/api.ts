import api from '../../services/api';
import { Report, RescueRequest } from '../../types';

// GET /api/v1/rescue/reports/   — public, only verified reports
export async function fetchReports(params?: { species?: string; breed?: string; location?: string }) {
  const res = await api.get('/rescue/reports/', { params });
  const data = res.data?.results || res.data?.data?.results || res.data?.data || res.data || [];
  return data as Report[];
}

export async function fetchReportDetail(id: number) {
  const res = await api.get(`/rescue/reports/${id}/`);
  return (res.data?.data || res.data) as Report;
}

// GET /api/v1/rescue/reports/search/   — public search
export async function searchReports(params: { species?: string; breed?: string; location?: string }) {
  const res = await api.get('/rescue/reports/search/', { params });
  const data = res.data?.data || res.data?.results || res.data || [];
  return data as Report[];
}

// GET /api/v1/rescue/reports/my-reports/   — auth required
export async function fetchMyReports() {
  const res = await api.get('/rescue/reports/my-reports/');
  const data = res.data?.data || res.data?.results || res.data || [];
  return data as Report[];
}

// GET /api/v1/rescue/reports/  (admin - all reports)
export async function fetchAllReports() {
  const res = await api.get('/rescue/reports/');
  const data = res.data?.results || res.data?.data?.results || res.data?.data || res.data || [];
  return data as Report[];
}

// POST /api/v1/rescue/reports/
export async function createReport(data: {
  report_type: 'Lost' | 'Found';
  location: string;
  description?: string;
  pet_data: {
    name: string;
    species: string;
    breed?: string;
    color?: string;
    age?: number;
    gender?: string;
    size?: string;
    image_url?: string;
    image_public_id?: string;
  };
}) {
  const res = await api.post('/rescue/reports/', data);
  return (res.data?.data || res.data) as Report;
}

// POST /api/v1/rescue/reports/:id/verify/  (Admin only)
export async function verifyReport(id: number) {
  const res = await api.post(`/rescue/reports/${id}/verify/`);
  return res.data;
}

// ─── Rescue Requests ───

// GET /api/v1/rescue/requests/
export async function fetchRescueRequests() {
  const res = await api.get('/rescue/requests/');
  const data = res.data?.results || res.data?.data?.results || res.data?.data || res.data || [];
  return data as RescueRequest[];
}

// GET /api/v1/rescue/requests/my-requests/
export async function fetchMyRescueRequests() {
  const res = await api.get('/rescue/requests/my-requests/');
  const data = res.data?.data || res.data?.results || res.data || [];
  return data as RescueRequest[];
}

// POST /api/v1/rescue/requests/
export async function createRescueRequest(data: { report: number; message?: string }) {
  const res = await api.post('/rescue/requests/', data);
  return (res.data?.data || res.data) as RescueRequest;
}
