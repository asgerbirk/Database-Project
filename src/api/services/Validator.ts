// TODO Opsæt hjælpe funktioner til at validere data til brug i unit tests
// TODO Hvordan skal retur typerne være her? True/false ? True / false + fejlbesked?
import { z } from 'zod';

// Use of RFC 5322 standard for email validation
const emailSchema = z.string().email("Invalid email format");

export function validateEmail(email: string) {
  try {
    emailSchema.parse(email); // This will throw if the email is invalid
    return { isValid: true }; // If no error, email is valid
  } catch (error) {
    return { isValid: false, message: error.errors[0].message }; // Return error message from Zod
  }
}

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one special character and one number 
// TODO maximum 20 characters? maximum 25? 30?
export  function validatePassword(password: string) {
  //const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  if (!password) {
    return { isValid: false, message: "Password cannot be empty" };
  }

  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long" };
  }

  if (password.length > 20) {
    return { isValid: false, message: "Password cannot be longer than 20 characters" };
  }

  if (!passwordRegex.test(password)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" };
  }

  return { isValid: true };
}

const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters long.")
  .max(20, "Password cannot be longer than 20 characters.")
  .regex(/[A-Z]/, "Password must have at least one uppercase letter.")
  .regex(/[a-z]/, "Password must have at least one lowercase letter.")
  .regex(/\d/, "Password must have at least one number.")
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, "Password must have at least one special character.");


export function validateZodPassword(password: string) {
  try {
    passwordSchema.parse(password);
    return { isValid: true };
  } catch (error) {
    return { isValid: false, message: error.errors[0].message };
  }
}

export function validateFirstName(name: string) {
  const nameRegex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;

  if (!name || name.trim() === "") {
    return { isValid: false, message: "First name cannot be empty" };
  }

  return nameRegex.test(name);
}

export function validateLastName(name: string) {
  const nameRegex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;

  if (!name || name.trim() === "") {
    return { isValid: false, message: "Last name cannot be empty" };
  }

  return nameRegex.test(name);
}

export  function validateMembershipId(membershipId: string) {
  const membershipIdRegex = /^[0-9]+$/;
  return membershipIdRegex.test(membershipId);
}

export function validateDateOfBirth(date: string) {
  const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

  // Check if the date is empty
  if (!date || date.trim() === "") {
    return { isValid: false, message: "Date of birth cannot be empty" };
  }

  // Check format
  if (!dateRegex.test(date)) {
    return { isValid: false, message: "Date must be in dd-mm-yyyy format" };
  }

  // Parse date components
  const [day, month, year] = date.split("-").map(Number);

  // Check logical validity of the date
  const isValidDate = (d: number, m: number, y: number) => {
    const dateObj = new Date(y, m - 1, d); // Months are 0-indexed in JS
    return (
      dateObj.getFullYear() === y &&
      dateObj.getMonth() === m - 1 &&
      dateObj.getDate() === d
    );
  };

  if (!isValidDate(day, month, year)) {
    return { isValid: false, message: "Date is not a valid calendar date" };
  }

  // Calculate age and validate range
  const today = new Date();
  const birthDate = new Date(year, month - 1, day);
  const age = today.getFullYear() - birthDate.getFullYear();
  const adjustedAge =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate())
      ? age
      : age - 1;

  if (adjustedAge < 16) {
    return { isValid: false, message: "Age must be at least 16 years" };
  }

  if (adjustedAge > 100) {
    return { isValid: false, message: "Age cannot exceed 100 years" };
  }

  // Check if the date is in the future
  if (birthDate > today) {
    return { isValid: false, message: "Date cannot be in the future" };
  }

  return { isValid: true };
}

export function validateAddress(address: string) {
  const addressRegex = /^[a-zA-Z0-9\\s,'’\\-éáàèùçöüßøåÆØÅÄÖ]*$/;

  if (!address || address.trim() === "") {
    return { isValid: false, message: "Address cannot be empty" };
  }

  if (address.length < 5 || address.length > 100) {
    return {
      isValid: false,
      message: "Address must be between 5 and 100 characters",
    };
  }

  if (!addressRegex.test(address)) {
    return {
      isValid: false,
      message:
        "Address contains invalid characters. Allowed: letters, numbers, spaces, commas, apostrophes, and hyphens",
    };
  }

  return { isValid: true };
}

// TODO Hvordan håndtere vi at telefonnummeret kan være et internationalt nummer? --> Det kan være op til 15 characters så??
export function validatePhoneNumber(phoneNumber: string) {
  const phoneRegex = /^(\+?\d{1,3})?(\d{8})$/;

  if (!phoneNumber || phoneNumber.trim() === "") {
    return { isValid: false, message: "Phone number cannot be empty" };
  }

  if (!phoneRegex.test(phoneNumber)) {
    return {
      isValid: false,
      message: "Phone number must be 8 digits or a valid international number",
    };
  }

  if (phoneNumber.length > 15 || phoneNumber.length < 8) {
    return {
      isValid: false,
      message: "Phone number must be between 8 and 15 digits",
    };
  }

  return { isValid: true };
}
