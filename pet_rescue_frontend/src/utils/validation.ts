import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"),
    password: z.string().min(6),
});

export const registerSchema = z.object({
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"),
    username: z.string().min(5),
    first_name: z.string().min(3),
    last_name: z.string().min(3),
    password: z.string()
        .min(6)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            "Password must contain uppercase, lowercase, number and special character"
        ),
    confirm_password: z.string().min(6),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

export const petReportSchema = z.object({
    pet_name: z.string().min(1),
    species: z.string().min(1),
    pet_gender: z.string().min(1),
    pet_size: z.string().min(1),
    pet_age: z.string().min(1),
    pet_color: z.string().min(1),
    pet_breed: z.string().min(1),
    pet_image: z.string().min(1),
    location: z.string().min(1),
    description: z.string().min(1),
    report_type: z.string().min(1),
    status: z.string().min(1),
    user_contact: z.string().min(1),
});

export const adoptionApplicationSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const rescueRequestSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const medicalRecordSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const vetVisitSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const fosterApplicationSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const volunteerApplicationSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const donationSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const sponsorshipSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const eventSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const newsSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const notificationSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const userSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const adminSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const superAdminSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const roleSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const permissionSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const rolePermissionSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const userRoleSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const userPermissionSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});

export const userRolePermissionSchema = z.object({
    pet_id: z.string().min(1),
    user_id: z.string().min(1),
    status: z.string().min(1),
    reason: z.string().min(1),
    additional_info: z.string().min(1),
});