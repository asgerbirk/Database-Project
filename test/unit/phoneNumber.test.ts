import { validatePhoneNumber } from "../../src/api/helpers/Validator";
import { describe, expect, it } from "vitest";

describe("validatePhoneNumber function - Manual Regex", () => {
  const validPhoneNumbers = [
    "12345678", // Local number
    "+4512345678", // International number
  ];

  const invalidPhoneNumbers = [
    { phone: "", message: "Phone number cannot be empty" }, // Empty input
    {
      phone: "1234567",
      message:
        "Phone number must be 8 digits or start with + followed by 10 digits",
    }, // Too short
    {
      phone: "+1234567",
      message:
        "Phone number must be 8 digits or start with + followed by 10 digits",
    }, // Too short with +
    {
      phone: "abcdefgh",
      message:
        "Phone number must be 8 digits or start with + followed by 10 digits",
    }, // Non-numeric
    {
      phone: "+451234567",
      message:
        "Phone number must be 8 digits or start with + followed by 10 digits",
    }, // Too short with +45
    {
      phone: "+45123456789",
      message:
        "Phone number must be 8 digits or start with + followed by 10 digits",
    }, // Too long with +45
    {
      phone: "1234567890",
      message:
        "Phone number must be 8 digits or start with + followed by 10 digits",
    }, // Too long
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
