import { ObjectId } from 'mongodb';

// 1. User Collection (Combining Person, Member, Employee)
export interface User {
  _id: ObjectId; // MongoDB ObjectId
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
  roles: UserRole; // Array of roles (e.g., ['member', 'employee'])
  joinDate?: Date; // For members
  membershipId?: ObjectId; // Reference to Membership _id, for members
  emergencyContact?: string; // For members
  hireDate?: Date; // For employees
  jobTitleId?: ObjectId; // Reference to JobTitle _id, for employees
  departmentId?: ObjectId; // Reference to Department _id, for employees
  salary?: number; // For employees
  employmentStatus?: string; // For employees
}

export type UserRole = 'member' | 'employee' | 'manager';

// 2. Center Collection (Combining Centers and Departments)
export interface Center {
  _id: ObjectId; // MongoDB ObjectId
  centerName: string;
  location: string;
  phone: string;
  email: string;
  openingHours: string;
  managerName: string;
  facilities: string;
  departments: Department[]; // Embedded departments
}

export interface Department {
  departmentName: string;
}

// 3. Membership Collection
export interface Membership {
  _id: ObjectId; // MongoDB ObjectId
  membershipName: string;
  pricePerMonth: number;
  accessLevel: string;
  duration: string; // e.g., '1 month', '3 months', '6 months', '12 months'
  maxClassBookings: number;
  description: string;
}

// 4. Class Collection (Combining Classes and Bookings)
export interface Class {
  _id: ObjectId; // MongoDB ObjectId
  className: string;
  description: string;
  classType: string;
  duration: number;
  maxParticipants: number;
  instructorId: ObjectId; // Reference to User _id (who is an employee)
  scheduleDate: Date;
  startTime: string; // Stored as string in ISO 8601 format (e.g., "09:00:00")
  endTime: string; // Stored as string in ISO 8601 format
  bookings: Booking[]; // Embedded bookings
}

export interface Booking {
  bookingDate: Date;
  status: string;
}

// 5. Product Collection (Combining Products and Categories)
export interface Product {
  _id: ObjectId; // MongoDB ObjectId
  productName: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: ProductCategory; // Embedded category
  paymentId?: ObjectId; // Optional Reference to Payment _id (if applicable)
}

export interface ProductCategory {
  categoryName: string;
  description: string;
}

// 6. Payment Collection
export interface Payment {
  _id: ObjectId; // MongoDB ObjectId
  userId: ObjectId; // Reference to User _id
  paymentDate: Date;
  amount: number;
  paymentMethod: string;
  paymentType: string;
  status: string;
}

// 7. Equipment Collection
export interface Equipment {
  _id: ObjectId; // MongoDB ObjectId
  machineName: string;
  type: string;
  location: string;
  manufacturer: string;
  purchaseDate: Date;
  maintenanceDate: Date;
  status: string;
  centerId: ObjectId; // Reference to Center _id
}
