import api from '../../services/api';
import { AdoptionListing, AdoptionRequest, Adoption } from '../../types';

// ─── Adoption Listing API calls ───

// GET /api/v1/adoption/listings/   — all available listings (paginated)
export async function fetchListings(params?: { species?: string; breed?: string }) {
  const res = await api.get('/adoption/listings/', { params });
  // Backend returns paginated results: { results: [...] } or direct array
  const data = res.data?.results || [];
  return data as AdoptionListing[];
}

// GET /api/v1/adoption/listings/search/
export async function searchListings(params: { species?: string; breed?: string; location?: string }) {
  const res = await api.get('/adoption/listings/search/', { params });
  return (res.data?.data || []) as AdoptionListing[];
}

// GET /api/v1/adoption/listings/:id/
export async function fetchListingDetail(id: number) {
  const res = await api.get(`/adoption/listings/${id}/`);
  return res.data?.data as AdoptionListing;
}

// POST /api/v1/adoption/listings/  (ShopOwner only)
export async function createListing(data: { pet: number; price: string; description?: string }) {
  const res = await api.post('/adoption/listings/', data);
  return res.data?.data as AdoptionListing;
}

// PATCH /api/v1/adoption/listings/:id/  (ShopOwner only)
export async function updateListing(id: number, data: Partial<AdoptionListing>) {
  const res = await api.patch(`/adoption/listings/${id}/`, data);
  return res.data?.data as AdoptionListing;
}

// DELETE /api/v1/adoption/listings/:id/  (ShopOwner only)
export async function deleteListing(id: number) {
  await api.delete(`/adoption/listings/${id}/`);
}

// ─── Adoption Request API calls ───

// GET /api/v1/adoption/requests/  — filtered by role (user sees own, shop owner sees for their listings)
export async function fetchRequests() {
  const res = await api.get('/adoption/requests/');
  return (res.data?.data?.results || res.data?.data || []) as AdoptionRequest[];
}

// POST /api/v1/adoption/requests/
export async function createAdoptionRequest(data: {
  pet: number;
  listing?: number;
  request_details?: string;
}) {
  const res = await api.post('/adoption/requests/', data);
  return res.data?.data as AdoptionRequest;
}

// PATCH /api/v1/adoption/requests/:id/accept-request/  (ShopOwner)
export async function acceptRequest(id: number) {
  const res = await api.patch(`/adoption/requests/${id}/accept-request/`);
  return res.data;
}

// POST /api/v1/adoption/requests/:id/reject-request/  (ShopOwner)
export async function rejectRequest(id: number) {
  const res = await api.post(`/adoption/requests/${id}/reject-request/`);
  return res.data;
}

// ─── Adoption records ───

// GET /api/v1/adoption/adoptions/   — role-filtered
export async function fetchAdoptions() {
  const res = await api.get('/adoption/adoptions/');
  return (res.data?.data?.results || res.data?.data || []) as Adoption[];
}
