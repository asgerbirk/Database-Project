// TODO Opsæt hjælpe funktioner til at validere data til brug i unit tests
// TODO Hvordan skal retur typerne være her? True/false ? True / false + fejlbesked?
import { number, z } from 'zod';

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
  // Tillad kun bogstaver, bindestreger og mellemrum
  const nameRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;

  // Tjek om input er tomt eller kun mellemrum
  if (!name || name.trim() === "") {
    return { isValid: false, message: "First name cannot be empty" };
  }

  // Tjek længden
  if (name.length < 2 || name.length > 50) {
    return { isValid: false, message: "First name must be between 2 and 50 characters" };
  }

  // Tjek om navnet matcher regex
  if (!nameRegex.test(name)) {
    return { isValid: false, message: "First name can only contain letters, spaces, and hyphens" };
  }

  // Alt er i orden
  return { isValid: true };
}

export function validateLastName(name: string) {
  // Regex tillader bogstaver, mellemrum og bindestreger
  const nameRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;

  // Tjek om input er tomt eller kun mellemrum
  if (!name || name.trim() === "") {
    return { isValid: false, message: "Last name cannot be empty" };
  }

  // Tjek længden
  if (name.length < 2 || name.length > 50) {
    return { isValid: false, message: "Last name must be between 2 and 50 characters" };
  }

  // Tjek om navnet matcher regex
  if (!nameRegex.test(name)) {
    return { isValid: false, message: "Last name can only contain letters, spaces, and hyphens" };
  }

  // Alt er i orden
  return { isValid: true };
}

export  function validateMembershipId(membershipId: string) {
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

  const resetTime = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
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
  // Trim whitespace for sikkerhed
  const trimmedPhone = phoneNumber.trim();

  // Tjek for tom streng
  if (trimmedPhone === "") {
    return { isValid: false, message: "Phone number cannot be empty" };
  }

  // Hvis præcis 8 tegn: skal være kun tal
  if (trimmedPhone.length === 8 && /^\d{8}$/.test(trimmedPhone)) {
    return { isValid: true };
  }

  // Hvis præcis 11 tegn: skal starte med + og efterfølges af 10 tal
  if (trimmedPhone.length === 11 && /^\+\d{10}$/.test(trimmedPhone)) {
    return { isValid: true };
  }

  // Hvis ikke matcher nogen af reglerne, returnér fejl
  return {
    isValid: false,
    message: "Phone number must be 8 digits or start with + followed by 10 digits",
  };
}
