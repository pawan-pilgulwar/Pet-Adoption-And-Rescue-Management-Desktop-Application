export interface UserProfile {
  address?: string;
  phone_number?: string;
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
  address?: string;
}

export interface AdminProfile {
  admin_level: string;
  profile_picture_url?: string;
  profile_picture_public_id?: string;
  phone_number?: string;
  address?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'USER' | 'SHOP_OWNER' | 'ADMIN';
  profile?: UserProfile | ShopOwnerProfile | AdminProfile;
}

export interface Pet {
  id: number;
  pet_id: string;
  name: string;
  species: string;
  breed: string;
  color: string;
  age?: number;
  gender?: string;
  size?: string;
  description?: string;
  vaccination_status?: string;
  image_url?: string;
  image_public_id?: string;
  created_at: string;
  created_by: number;
}

export interface AdoptionListing {
  id: number;
  pet: number;
  pet_detail: Pet;
  shop_owner: number;
  shop_detail: string;
  price: string;
  is_available: boolean;
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
  status: 'Pending' | 'Approved' | 'Rejected';
  request_details: string;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: number;
  rescue_id: string;
  user: number;
  user_detail: string;
  pet: number;
  pet_detail: Pet;
  report_type: 'Lost' | 'Found';
  location: string;
  description: string;
  is_verified: boolean;
  status: string;
  image_url?: string;
  image_public_id?: string;
  user_contact?: {
    email: string;
    phone: string;
    address: string;
  };
  created_at: string;
  updated_at: string;
  admin_comment?: string;
}

export interface RescueRequest {
  id: number;
  report: number;
  report_detail: Report;
  user: number;
  user_detail: string;
  status: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
  pet?: number;
  report?: number;
}
