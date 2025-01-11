import { validateDateOfBirth } from "../../src/api/services/Validator";
import { describe, expect, it } from "vitest";

describe("validateDateOfBirth function", () => {

const today = new Date();

const formattedDate = (date: Date) => `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

  const validDates = [
    { date: "01-01-2000", age: 23 }, // Normal valid date
    { date: "15-05-1980", age: 43 }, // Valid date, within range
    { date: "10-10-1925", age: 100 }, // Exactly 100 years old
  ];

  const invalidDates = [
    { date: "", message: "Date of birth cannot be empty" }, // Empty input
    { date: " ", message: "Date of birth cannot be empty" }, // Only whitespace
    { date: "32-01-2000", message: "Date is not a valid calendar date" }, // Invalid day
    { date: "10-13-2000", message: "Date is not a valid calendar date" }, // Invalid month
    { date: "01-01-2026", message: "Date cannot be in the future" }, // Future date
    { date: "01-01-2010", message: "Age must be at least 16 years" }, // Too young
    { date: "01-03-1905", message: "Age cannot exceed 100 years" }, // Too old
    { date: "01/01/2000", message: "Date must be in dd-mm-yyyy format" }, // Wrong format
    { date: "2000-01-01", message: "Date must be in dd-mm-yyyy format" }, // Wrong format
    { date: "abcd-ef-ghij", message: "Date must be in dd-mm-yyyy format" }, // Non-numeric input
  ];

  it("should return true for valid dates of birth", () => {
    for (const { date } of validDates) {
      const result = validateDateOfBirth(date);
      expect(result.isValid).toBe(true); // Tjekker kun isValid
    }
  });

  it("should return false for invalid dates of birth", () => {
    for (const { date, message } of invalidDates) {
      const result = validateDateOfBirth(date);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(message);
    }
  });

  it("should correctly validate edge cases", () => {
    const tooOldDate = "01-01-1910"; // Older than 100 years
    const futureDate = "01-01-2100"; // In the future
    const underageDate = "01-01-2010"; // Younger than 16 years

    expect(validateDateOfBirth(tooOldDate).isValid).toBe(false);
    expect(validateDateOfBirth(tooOldDate).message).toBe("Age cannot exceed 100 years");

    expect(validateDateOfBirth(futureDate).isValid).toBe(false);
    expect(validateDateOfBirth(futureDate).message).toBe("Date cannot be in the future");

    expect(validateDateOfBirth(underageDate).isValid).toBe(false);
    expect(validateDateOfBirth(underageDate).message).toBe("Age must be at least 16 years");
  });

  it("should handle exact boundaries", () => {
    const exactly16 = formattedDate(new Date(today.getFullYear() - 16, today.getMonth(), today.getDate()));
    const exactly100 = formattedDate(new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()));
  
    expect(validateDateOfBirth(exactly16).isValid).toBe(true); // 16 years old
    expect(validateDateOfBirth(exactly100).isValid).toBe(true); // 100 years old
  });

});
