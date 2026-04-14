export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'User' | 'Admin';
  phone_number?: string;
  address?: string;
  profile_picture_url?: string;
  profile_picture_public_id?: string;
}


export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  color: string;
  age?: number;
  gender?: string;
  size?: string;
  description?: string;
  vaccination_status?: string;
  status: string;
  image_url?: string;
  image_public_id?: string;
  created_at: string;
  created_by: number;
}


export interface PetReportPetData {
  id?: number;
  name?: string;
  species?: string;
  breed?: string;
  color?: string;
  age?: number;
  gender?: string;
  size?: string;
  description?: string;
  status?: string;
  image_url?: string | null;
  image_public_id?: string | null;
}


export interface PetReport {
  id: number;
  pet_data: PetReportPetData;
  report_type: 'Lost' | 'Found';
  pet_name: string;
  species: string;
  pet_breed: string;
  pet_color: string;
  pet_age?: number;
  pet_gender?: string;
  pet_size?: string;
  pet_status: 'Lost' | 'Found';
  image_url?: string;
  image_public_id?: string;
  location: string;
  user_contact?: {
    email: string;
    phone?: string;
    address?: string;
  };
  description: string;
  report_status: 'Pending' | 'Accepted' | 'Rejected' | 'Closed';
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Closed';
  admin_comment?: string;
  user: number;
  user_detail?: string;
  date_reported?: string;
  created_at: string;
  reviewed_at?: string;
  pet?: Pet;
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
