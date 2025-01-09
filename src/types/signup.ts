import { z } from 'zod'

export const registrationSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),

  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  dateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date)
    const today = new Date()
    const minAge = 16
    const maxAge = 100
    const age = today.getFullYear() - birthDate.getFullYear()
    return age >= minAge && age <= maxAge
  }, { message: "You must be between 16 and 100 years old" }),
  membershipId: z.string().min(1, { message: "Please select a membership type" }),
  emergencyContact: z.string().min(5, { message: "Emergency contact must be at least 5 characters" }),
  image: z.string().optional(),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
});

export type RegistrationSchema = z.infer<typeof registrationSchema>;
