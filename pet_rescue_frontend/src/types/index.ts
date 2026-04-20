// ─── Users ───────────────────────────────────────────────────────────────────
export type Role = 'USER' | 'SHOP_OWNER' | 'ADMIN';

export interface UserProfile {
  address: string;
  phone_number: string;
  profile_picture_url?: string;
  profile_picture_public_id?: string;
}

export interface ShopOwnerProfile {
  shop_name: string;
  shop_address: string;
  phone_number: string;
  shop_license: string;
  profile_picture_url?: string;
  profile_picture_public_id?: string;
}

export interface AdminProfile {
  admin_level: string;
  profile_picture_url?: string;
  profile_picture_public_id?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  created_at: string;
  profile?: UserProfile | ShopOwnerProfile | AdminProfile;
}

// ─── Pets ─────────────────────────────────────────────────────────────────────
export interface Pet {
  id: number;
  pet_id: string;
  name: string;
  species: string;
  breed?: string;
  color?: string;
  age?: number;
  gender?: string;
  size?: string;
  description?: string;
  vaccination_status?: string;
  image_url?: string;
  image_public_id?: string;
  owner: number;
  created_at: string;
  created_by_detail?: string;
}

// ─── Adoption ─────────────────────────────────────────────────────────────────
export interface AdoptionListing {
  id: number;
  pet: number;
  pet_detail: Pet;
  shop_owner: number;
  shop_detail: User;
  price: string;
  is_available: boolean;
  description?: string;
  created_at: string;
}

export interface AdoptionRequest {
  id: number;
  user: number;
  user_detail: string;
  pet: number;
  pet_detail: Pet;
  listing: number;
  listing_detail?: AdoptionListing;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  request_details?: string;
  created_at: string;
  updated_at: string;
}

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
  adopted_at?: string;
  notes?: string;
}

// ─── Rescue ───────────────────────────────────────────────────────────────────
export interface Report {
  id: number;
  rescue_id: string;
  user: number;
  user_detail: string;
  pet: number;
  pet_detail?: Pet;
  report_type: 'Lost' | 'Found';
  location: string;
  description?: string;
  is_verified: boolean;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Closed';
  image_url?: string;
  user_contact?: { email: string; phone: string; address: string };
  created_at: string;
  updated_at: string;
  admin_comment?: string;
}

export interface RescueRequest {
  id: number;
  report: number;
  report_detail?: Report;
  user: number;
  user_detail: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed';
  message?: string;
  created_at: string;
}

// ─── Services ─────────────────────────────────────────────────────────────────
export interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url?: string;
  created_at: string;
}

export interface Booking {
  id: number;
  user: number;
  user_name: string;
  service: number;
  service_name: string;
  service_price: string;
  booking_date: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  additional_notes?: string;
  created_at: string;
}

export interface Schedule {
  id: number;
  service: number;
  day: string;
  start_time: string;
  end_time: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────
export interface Notification {
  id: number;
  user: User;
  pet?: Pet;
  report?: Report;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ─── API Response wrapper ─────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  status_code: number;
  message: string;
  data: T;
}
