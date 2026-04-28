// ─────────────────────────────────────────────
// Shared TypeScript types — derived from backend serializers
// ─────────────────────────────────────────────

// User roles (matches backend USER_ROLE_CHOICES)
export type UserRole = 'USER' | 'SHOP_OWNER' | 'ADMIN';

// Profile shapes returned inside UserReadSerializer
export interface UserProfile {
  address: string;
  phone_number: string;
  profile_picture_url: string | null;
  profile_picture_public_id: string | null;
}

export interface ShopOwnerProfile {
  shop_name: string;
  shop_address: string;
  phone_number: string;
  shop_license?: string;
  profile_picture_url: string | null;
  profile_picture_public_id: string | null;
}

export interface AdminProfile {
  admin_level: string;
  profile_picture_url: string | null;
  profile_picture_public_id: string | null;
}

// Main User type (matches UserReadSerializer)
export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  created_at: string;
  profile: UserProfile | ShopOwnerProfile | AdminProfile | null;
}

// Pet (matches PetSerializer)
export interface Pet {
  id: number;
  pet_id: string;
  name: string;
  species: string;
  breed: string | null;
  color: string | null;
  age: number | null;
  gender: string | null;
  size: string | null;
  description: string | null;
  owner: number | null;
  vaccination_status: string | null;
  image_url: string | null;
  image_public_id: string | null;
  created_at: string;
  updated_at: string;
  created_by_detail: string;
}

// Adoption Listing (matches AdoptionListingSerializer)
export interface AdoptionListing {
  id: number;
  pet: number;
  pet_detail: Pet;
  shop_owner: number;
  shop_detail: User;
  price: string;
  is_available: boolean;
  created_at: string;
  description: string | null;
  image_url: string | null;
}

// Adoption Request (matches AdoptionRequestSerializer)
export interface AdoptionRequest {
  id: number;
  user: number;
  user_detail: string;
  pet: number;
  pet_detail: Pet;
  listing: number | null;
  listing_detail: AdoptionListing | null;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  request_details: string | null;
  created_at: string;
  updated_at: string;
}

// Adoption record (matches AdoptionSerializer)
export interface Adoption {
  id: number;
  user: number;
  user_detail: string;
  pet: number;
  pet_detail: Pet;
  shop_owner: number;
  shop_detail: string;
  price: string;
  status: string;
  adopted_at: string | null;
  notes: string | null;
}

// Report (matches ReportSerializer)
export interface Report {
  id: number;
  rescue_id: string;
  user: number;
  user_detail: string;
  pet: number | null;
  pet_detail: Pet | null;
  report_type: 'Lost' | 'Found';
  location: string;
  description: string | null;
  is_verified: boolean;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Closed';
  created_at: string;
  updated_at: string;
  user_contact: {
    username: string;
    email: string;
    phone: string;
    address: string;
  };
}

// Rescue Request (matches RescueRequestSerializer)
export interface RescueRequest {
  id: number;
  report: number;
  report_detail: Report;
  user: number;
  user_detail: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed';
  message: string | null;
  created_at: string;
  updated_at: string;
}

// Service (matches ServiceSerializer)
export interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string | null;
  duration: string | null;
  owner_name?: string;
  created_by: number;
  schedules: Schedule[];
  created_at: string;
  updated_at: string;
}

// Booking (matches BookingSerializer)
export interface Booking {
  id: number;
  user: number;
  user_name: string;
  service: number;
  service_name: string;
  service_price: string;
  booking_date: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  additional_notes: string | null;
  created_at: string;
  updated_at: string;
}

// Schedule (matches ScheduleSerializer)
export interface Schedule {
  id: number;
  service: number;
  day: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

// Notification (matches NotificationSerializer)
export interface Notification {
  id: number;
  user: number;
  pet: number | null;
  report: number | null;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

// Standard API response wrapper from ResponseMixin
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Admin dashboard response shape
export interface AdminDashboardData {
  total_users: number;
  total_reports: number;
  total_pets: number;
  total_services: number;
  total_adoptions: number;
  total_rescues: number;
  report_stats: {
    pending: number;
    accepted: number;
    rejected: number;
  };
  recent_activity: {
    reports: Report[];
    users: User[];
    adoptions: Adoption[];
  };
}
