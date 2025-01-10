import { validatePhoneNumber } from "../../src/api/services/Validator";
import { describe, expect, it } from "vitest";

describe("validatePhoneNumber function - Manual Regex", () => {
  const validPhoneNumbers = [
    "12345678",    // Lokalt nummer
    "+4512345678", // Med landskode
  ];

  const invalidPhoneNumbers = [
    { phone: "", message: "Phone number cannot be empty" },                     // Tom streng
    { phone: "1234567", message: "Phone number must be 8 digits or start with + followed by 10 digits" }, // For kort
    { phone: "+1234567", message: "Phone number must be 8 digits or start with + followed by 10 digits" }, // Forkert længde med +
    { phone: "abcdefgh", message: "Phone number must be 8 digits or start with + followed by 10 digits" }, // Bogstaver
    { phone: "+451234567", message: "Phone number must be 8 digits or start with + followed by 10 digits" }, // For kort med +
    { phone: "+45123456789", message: "Phone number must be 8 digits or start with + followed by 10 digits" }, // For langt med +
  ];

  it("should return true for valid phone numbers", () => {
    for (const phoneNumber of validPhoneNumbers) {
      const result = validatePhoneNumber(phoneNumber);
      expect(result.isValid).toBe(true);
    }
  });

  it("should return false for invalid phone numbers", () => {
    for (const { phone, message } of invalidPhoneNumbers) {
      const result = validatePhoneNumber(phone);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe(message);
    }
  });
});
