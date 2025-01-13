import { validateName } from "../../src/api/services/Validator";
import { describe, expect, it } from "vitest";

describe("validateLastName function", () => {
  const validNames = ["Smith", "Doe", "Smith-Jones", "van der Laan"];
  const invalidNames = ["", " ", "Smith1", "Doe@", "Smith1 Doe", "John-Doe1"];

  it("should return true for valid last names", () => {
    for (const name of validNames) {
      const result = validateName(name);
      expect(result.isValid).toBe(true);  
    }
  });

  it("should return false for invalid last names", () => {
    for (const name of invalidNames) {
      const result = validateName(name);
      expect(result.isValid).toBe(false);
      expect(result.message).toBeDefined(); 
    }
  });

  it("should return false for empty names", () => {
    const name = "";
    const result = validateName(name);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Name cannot be empty");
  });

  it("should return false for names with only whitespace", () => {
    const name = " ";
    const result = validateName(name);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Name cannot be empty"); 
  });

  it("should return false for names with numbers", () => {
    const name = "Smith1";
    const result = validateName(name);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Name can only contain letters, spaces, and hyphens"); 
  });
});
