import api from '../../services/api';
import { Service, Booking, Schedule } from '../../types';

// GET /api/v1/pet-services/
export async function fetchServices() {
  const res = await api.get('/pet-services/');
  return (res.data?.results) as Service[];
}

export async function fetchServiceDetail(id: number) {
  const res = await api.get(`/pet-services/${id}/`);
  return res.data as Service;
}

// POST /api/v1/pet-services/  (Admin/ShopOwner)
export async function createService(data: { name: string; description: string; price: string; image_url?: string }) {
  const res = await api.post('/pet-services/', data);
  return res.data?.data as Service;
}

// PATCH /api/v1/pet-services/:id/  (Admin/ShopOwner)
export async function updateService(id: number, data: Partial<Service>) {
  const res = await api.patch(`/pet-services/${id}/`, data);
  return res.data?.data as Service;
}

// DELETE /api/v1/pet-services/:id/
export async function deleteService(id: number) {
  await api.delete(`/pet-services/${id}/`);
}

// ─── Bookings ───

// GET /api/v1/bookings/
export async function fetchBookings() {
  const res = await api.get('/bookings/');
  return (res.data?.results || []) as Booking[];
}

// POST /api/v1/bookings/
export async function createBooking(data: {
  service: number;
  booking_date: string;
  additional_notes?: string;
}) {
  const res = await api.post('/bookings/', data);
  return res.data?.data as Booking;
}

// ─── Schedules ───

// GET /api/v1/schedules/
export async function fetchSchedules() {
  const res = await api.get('/schedules/');
  return (res.data?.data?.results || res.data?.data || res.data || []) as Schedule[];
}

// POST /api/v1/schedules/ (Admin/ShopOwner)
export async function createSchedule(data: {
  service: number;
  day: string;
  start_time: string;
  end_time: string;
}) {
  const res = await api.post('/schedules/', data);
  return res.data?.data as Schedule;
}

// DELETE /api/v1/schedules/:id/
export async function deleteSchedule(id: number) {
  await api.delete(`/schedules/${id}/`);
}
