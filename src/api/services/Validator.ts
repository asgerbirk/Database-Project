import { z } from "zod";

// Use of RFC 5322 standard for email validation
const emailSchema = z.string().email("Invalid email format");

export function validateEmail(email: string) {
  try {
    emailSchema.parse(email); 
    return { isValid: true };
  } catch (error) {
    return { isValid: false, message: error.errors[0].message };
  }
}

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(20, "Password cannot be longer than 20 characters.")
  .regex(/[A-Z]/, "Password must have at least one uppercase letter.")
  .regex(/[a-z]/, "Password must have at least one lowercase letter.")
  .regex(/\d/, "Password must have at least one number.")
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    "Password must have at least one special character."
  );

export function validateZodPassword(password: string) {
  try {
    passwordSchema.parse(password);
    return { isValid: true };
  } catch (error) {
    return { isValid: false, message: error.errors[0].message };
  }
}

const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters long.")
  .max(50, "Name cannot be longer than 50 characters.")
  .regex(
    /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/,
    "Name can only contain letters, spaces, and hyphens."
  );

export function validateZodName(name: string) {
  try {
    nameSchema.parse(name);
    return { isValid: true };
  } catch (error) {
    return { isValid: false, message: error.errors[0].message };
  }
}

export function validateName(name: string) {
  // Tillad kun bogstaver, bindestreger og mellemrum
  const nameRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;


  if (!name || name.trim() === "") {
    return { isValid: false, message: "First name cannot be empty" };
  }

  if (name.length < 2 || name.length > 50) {
    return {
      isValid: false,
      message: "First name must be between 2 and 50 characters",
    };
  }

  if (!nameRegex.test(name)) {
    return {
      isValid: false,
      message: "First name can only contain letters, spaces, and hyphens",
    };
  }

  return { isValid: true };
}


export function validateMembershipId(membershipId: string) {
  const membershipIdRegex = /^[0-9]+$/;
  return membershipIdRegex.test(membershipId);
}

export function validateDateOfBirth(date: string) {
  const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

  if (!date || date.trim() === "") {
    return { isValid: false, message: "Date of birth cannot be empty" };
  }

  if (!dateRegex.test(date)) {
    return { isValid: false, message: "Date must be in dd-mm-yyyy format" };
  }

  const [day, month, year] = date.split("-").map(Number);

  const isValidDate = (d: number, m: number, y: number) => {
    const dateObj = new Date(y, m - 1, d);
    return (
      dateObj.getFullYear() === y &&
      dateObj.getMonth() === m - 1 &&
      dateObj.getDate() === d
    );
  };

  if (!isValidDate(day, month, year)) {
    return { isValid: false, message: "Date is not a valid calendar date" };
  }

  const resetTime = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  const today = resetTime(new Date());
  const birthDate = resetTime(new Date(year, month - 1, day));

  if (birthDate > today) {
    return { isValid: false, message: "Date cannot be in the future" };
  }

  const age = today.getFullYear() - birthDate.getFullYear();
  const isBirthdayPassedThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());
  const adjustedAge = isBirthdayPassedThisYear ? age : age - 1;

  if (adjustedAge < 16) {
    return { isValid: false, message: "Age must be at least 16 years" };
  }

  if (adjustedAge > 100) {
    return { isValid: false, message: "Age cannot exceed 100 years" };
  }

  return { isValid: true };
}

export function validatePhoneNumber(phoneNumber: string) {
  const trimmedPhone = phoneNumber.trim();

  if (trimmedPhone === "") {
    return { isValid: false, message: "Phone number cannot be empty" };
  }

  // If exactly 8 digits: must be a local number
  if (trimmedPhone.length === 8 && /^\d{8}$/.test(trimmedPhone)) {
    return { isValid: true };
  }

  // If starts with + and has 10 digits: must be an international number
  if (trimmedPhone.length === 11 && /^\+\d{10}$/.test(trimmedPhone)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    message:
      "Phone number must be 8 digits or start with + followed by 10 digits",
  };
}

export function isClassFull(
  classData: any,
  bookingCount: number
): string | undefined {
  // 1) If classData is null or undefined, return an error or throw
  if (!classData) {
    return "Invalid class data (cannot be null)";
    // or throw new Error("classData cannot be null");
  }

  // 2) If MaxParticipants is negative, decide your domain rule
  if (classData.MaxParticipants <= 0) {
    return "Invalid negative capacity or 0";
  }

  // 3) If bookingCount > MaxParticipants => full
  if (bookingCount > classData.MaxParticipants) {
    return "Class is already full";
  }

  // 4) Otherwise, not full
  return undefined;
}

// src/api/services/Validator.ts

/**
 * Validates the PricePerMonth input.
 * - Must be a number.
 * - Must be between 0 and 10000 (adjust as per your business rules).
 * - Truncates to two decimal places without rounding.
 * - Returns 0 for invalid inputs.
 *
 * @param pricePerMonth - The input value for PricePerMonth.
 * @returns A validated number for PricePerMonth.
 */
export function validatePricePerMonth(pricePerMonth: any): number {
  const MIN_PRICE = 0;
  const MAX_PRICE = 10000;
  //isFinitie only take valid number
  if (
    typeof pricePerMonth === "number" &&
    isFinite(pricePerMonth) &&
    pricePerMonth >= MIN_PRICE &&
    pricePerMonth <= MAX_PRICE
  ) {
    // Format to two decimal places
    const formattedPrice = Number(pricePerMonth.toFixed(2));
    return formattedPrice;
  }

  // Return 0 for invalid inputs
  return 0;
}
