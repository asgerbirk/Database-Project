// MongoDB Collections Definition for Equivalent SQL Tables

import { ObjectId } from 'mongodb';

// 1. Person Collection
export interface Person {
  _id: ObjectId; // MongoDB ObjectId
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
}

// 2. Centers Collection
export interface Center {
  _id: ObjectId; // MongoDB ObjectId
  centerName: string;
  location: string;
  phone: string;
  email: string;
  openingHours: string;
  managerName: string;
  facilities: string;
}

// 3. JobTitles Collection
export interface JobTitle {
  _id: ObjectId; // MongoDB ObjectId
  jobTitleName: string;
  description: string;
}

// 4. Departments Collection
export interface Department {
  _id: ObjectId; // MongoDB ObjectId
  departmentName: string;
  managerId?: ObjectId; // Reference to Employees _id
}

// 5. Memberships Collection
export interface Membership {
  _id: ObjectId; // MongoDB ObjectId
  membershipName: string;
  pricePerMonth: number;
  accessLevel: string;
  duration: string;
  maxClassBookings: number;
  description: string;
}

// 6. Members Collection
export interface Member {
  _id: ObjectId; // MongoDB ObjectId
  personId: ObjectId; // Reference to Person _id
  joinDate: Date;
  membershipId: ObjectId; // Reference to Membership _id
  emergencyContact: string;
}

// 7. Employees Collection
export interface Employee {
  _id: ObjectId; // MongoDB ObjectId
  personId: ObjectId; // Reference to Person _id
  hireDate: Date;
  jobTitleId: ObjectId; // Reference to JobTitle _id
  departmentId: ObjectId; // Reference to Department _id
  salary: number;
  employmentStatus: string;
}

// 8. Classes Collection
export interface Class {
  _id: ObjectId; // MongoDB ObjectId
  className: string;
  description: string;
  classType: string;
  duration: number;
  maxParticipants: number;
  employeeId: ObjectId; // Reference to Employee _id
  scheduleDate: Date;
  startTime: string; // Stored as string in ISO 8601 format (e.g., "09:00:00")
  endTime: string; // Stored as string in ISO 8601 format
}

// 9. Payments Collection
export interface Payment {
  _id: ObjectId; // MongoDB ObjectId
  memberId: ObjectId; // Reference to Member _id
  paymentDate: Date;
  amount: number;
  paymentMethod: string;
  paymentType: string;
  status: string;
}

// 10. Bookings Collection
export interface Booking {
  _id: ObjectId; // MongoDB ObjectId
  memberId: ObjectId; // Reference to Member _id
  classId: ObjectId; // Reference to Class _id
  bookingDate: Date;
  status: string;
}

// 11. ProductCategories Collection
export interface ProductCategory {
  _id: ObjectId; // MongoDB ObjectId
  categoryName: string;
  description: string;
}

// 12. Products Collection
export interface Product {
  _id: ObjectId; // MongoDB ObjectId
  productName: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: ObjectId; // Reference to ProductCategory _id
  paymentId?: ObjectId; // Optional Reference to Payment _id (if applicable)
}

// 13. Equipment Collection
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
