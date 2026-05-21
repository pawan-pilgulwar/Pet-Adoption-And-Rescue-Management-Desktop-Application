import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  first_name: z.string()
    .min(2, 'First name must be at least 2 characters')
    .regex(/^[A-Za-z]+$/, 'First name should contain only letters'),

  last_name: z.string()
    .min(1, 'Last name is required')
    .regex(/^[A-Za-z]+$/, 'Last name should contain only letters'),

  username: z.string().min(5, 'Username must be at least 5 characters'),

  email: z.string().email('Invalid email address'),

  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),

  role: z.enum(['USER', 'SHOP_OWNER'] as const),

  address: z.string().optional(),

  phone_number: z.string()
    .regex(/^\+?[\d\s-]{10,}$/, 'Enter a valid phone number with at least 10 digits'),

  shop_name: z.string().optional(),
  shop_address: z.string().optional(),
  shop_license: z.string().optional(),

}).refine((data) => {
  if (data.role === 'USER') {
    return !!data.address && data.address.trim().length > 0;
  }

  return !!data.shop_name && !!data.shop_address && !!data.shop_license;
}, {
  message: "Missing required fields for selected role",
  path: ["role"],
});

// Service Schema
export const serviceSchema = z.object({
  name: z.string().min(3, 'Service name must be at least 3 characters'),

  description: z.string().min(10, 'Description must be at least 10 characters'),

  price: z.string()
    .regex(/^(0|[1-9]\d*)(\.\d{1,2})?$/, 'Enter a valid price greater than or equal to 0'),

  duration: z.string().optional(),
});

// Adoption Listing Schema
export const listingSchema = z.object({
  pet: z.string().min(1, 'Please select a pet'),
  price: z.string().regex(/^(0|[1-9]\d*)(\.\d{1,2})?$/, 'Enter a valid price greater than or equal to 0'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

// Pet Schema
export const petSchema = z.object({
  name: z.string().min(2, 'Pet name is required').regex(/^[A-Za-z]+$/, 'Pet name should contain only letters'),
  species: z.string().min(2, 'Species is required').regex(/^[A-Za-z]+$/, 'Species should contain only letters'),
  breed: z.string().regex(/^[A-Za-z]+$/, 'Breed should contain only letters').optional(),
  age: z.string().regex(/^(0|[1-9]\d*)$/, 'Age must be a valid positive number').optional().or(z.literal('')),
  gender: z.string().regex(/^[A-Za-z]+$/, 'Gender should contain only letters').optional(),
  size: z.string().regex(/^[A-Za-z]+$/, 'Size should contain only letters').optional(),
  color: z.string().regex(/^[A-Za-z]+$/, 'Color should contain only letters').optional(),
  vaccination_status: z.string().regex(/^[A-Za-z]+$/, 'Vaccination status should contain only letters').optional(),
  description: z.string().optional(),
});

// Rescue Report Schema
export const reportSchema = z.object({
  report_type: z.enum(['Lost', 'Found']),
  location: z.string().min(5, 'Location details are required'),
  description: z.string().optional(),
  pet_name: z.string().min(2, 'Pet name is required').regex(/^[A-Za-z]+$/, 'Pet name should contain only letters'),
  species: z.string().min(2, 'Species is required').regex(/^[A-Za-z]+$/, 'Species should contain only letters'),
  breed: z.string().regex(/^[A-Za-z]+$/, 'Breed should contain only letters').optional(),
  color: z.string().regex(/^[A-Za-z]+$/, 'Color should contain only letters').optional(),
  age: z.string().regex(/^(0|[1-9]\d*)$/, 'Age must be a valid positive number').optional().or(z.literal('')),
  gender: z.string().regex(/^[A-Za-z]+$/, 'Gender should contain only letters').optional(),
  size: z.string().regex(/^[A-Za-z]+$/, 'Size should contain only letters').optional(),
});

// Booking Schema
export const bookingSchema = z.object({
  service: z.number().or(z.string().min(1, 'Please select a service')),
  booking_date: z.string().min(1, 'Please select a date and time').refine((val) => new Date(val) >= new Date(), {
    message: "Booking date must be in the future",
  }),
  additional_notes: z.string().optional(),
});
