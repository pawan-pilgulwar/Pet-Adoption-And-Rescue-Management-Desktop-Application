import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  username: z.string().min(5, 'Username must be at least 5 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['USER', 'SHOP_OWNER'] as const),
  address: z.string().optional(),
  phone_number: z.string().min(10, 'Phone number must be at least 10 characters'),
  shop_name: z.string().optional(),
  shop_address: z.string().optional(),
  shop_license: z.string().optional(),
}).refine((data) => {
  if (data.role === 'USER') return !!data.address;
  return !!data.shop_name && !!data.shop_address && !!data.shop_license;
}, {
  message: "Missing required fields for selected role",
  path: ["role"],
});

// Service Schema
export const serviceSchema = z.object({
  name: z.string().min(3, 'Service name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid price'),
  duration: z.string().optional(),
});

// Adoption Listing Schema
export const listingSchema = z.object({
  pet: z.string().min(1, 'Please select a pet'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid price'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

// Pet Schema
export const petSchema = z.object({
  name: z.string().min(2, 'Pet name is required'),
  species: z.string().min(2, 'Species is required'),
  breed: z.string().optional(),
  age: z.string().regex(/^\d*$/, 'Age must be a number').optional(),
  gender: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  vaccination_status: z.string().optional(),
  description: z.string().optional(),
});

// Rescue Report Schema
export const reportSchema = z.object({
  report_type: z.enum(['Lost', 'Found']),
  location: z.string().min(5, 'Location details are required'),
  description: z.string().optional(),
  pet_name: z.string().min(2, 'Pet name is required'),
  species: z.string().min(2, 'Species is required'),
  breed: z.string().optional(),
  color: z.string().optional(),
  age: z.string().regex(/^\d*$/, 'Age must be a number').optional(),
  gender: z.string().optional(),
  size: z.string().optional(),
});

// Booking Schema
export const bookingSchema = z.object({
  service: z.number().or(z.string().min(1, 'Please select a service')),
  booking_date: z.string().min(1, 'Please select a date and time'),
  additional_notes: z.string().optional(),
});
