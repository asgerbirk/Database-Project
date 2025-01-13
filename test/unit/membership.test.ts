// test/unit/validatePricePerMonth.test.ts

import { describe, it, expect } from "vitest";
import { validatePricePerMonth } from "../../src/api/helpers/Validator"; // Adjust the path as needed

describe("validatePricePerMonth Function", () => {
  const priceProvider = [
    //valid

    { value: 500, expected: 500 },
    { value: 9999.99, expected: 9999.99 }, // Upper boundary valid
    { value: 10000, expected: 10000 }, // Maximum valid price

    //invalid
    { value: 0, expected: 0 },
    { value: 0.0, expected: 0 },
    { value: 10000.01, expected: 0 }, // Above maximum
    { value: -1, expected: 0 }, // Negative value
    { value: 2500.346, expected: 2500.35 }, //We have used toFixed(2) and that rounds the number up, so 6-9 rounds up and 5-1 do not
    { value: 2500.343, expected: 2500.34 }, //We have used toFixed(2) and that rounds the number up, so 6-9 rounds up and 5-1 do not
    { value: "5000", expected: 0 },
    { value: "abc", expected: 0 },
    { value: null, expected: 0 },
    { value: undefined, expected: 0 },
    { value: {}, expected: 0 },
    { value: false, expected: 0 },
    { value: true, expected: 0 },
    { value: NaN, expected: 0 }, // Not a Number
    { value: Infinity, expected: 0 }, // Infinite value
    { value: -Infinity, expected: 0 }, // Negative Infinite value
  ];

  describe.each(priceProvider)(
    "validatePricePerMonth tests",
    ({ value, expected }) => {
      it(`validatePricePerMonth(${value}) should return ${expected}`, () => {
        const result = validatePricePerMonth(value);
        expect(result).toBe(expected);
      });
    }
  );
});
