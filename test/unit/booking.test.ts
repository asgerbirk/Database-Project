// isClassFull.test.ts
import { describe, it, expect } from "vitest";
import { isClassFull } from "../../src/api/services/Validator";

describe("Test of booking - isClassFull function", () => {
  // Each object in this array describes:
  //  - the input (`classData`, `bookingCount`)
  //  - the expected return (`expected`)
  //  - a short `description` for logging
  const classFullProvider = [
    {
      description: "bookingCount < MaxParticipants",
      value: { classData: { MaxParticipants: 5 }, bookingCount: 4 },
      expected: undefined,
    },
    {
      description: "bookingCount = MaxParticipants",
      value: { classData: { MaxParticipants: 5 }, bookingCount: 5 },
      expected: undefined,
    },
    {
      description: "bookingCount > MaxParticipants ",
      value: { classData: { MaxParticipants: 5 }, bookingCount: 6 },
      expected: "Class is already full",
    },

    {
      description: "huge MaxParticipants, bookingCount is smaller",
      value: { classData: { MaxParticipants: 999999999 }, bookingCount: 1 },
      expected: undefined,
    },

    {
      description: "MaxParticipants = 0, bookingCount = 0",
      value: { classData: { MaxParticipants: 0 }, bookingCount: 0 },
      expected: "Invalid negative capacity or 0",
    },
    {
      description: "MaxParticipants = 0, bookingCount = 1 ",
      value: { classData: { MaxParticipants: 0 }, bookingCount: 1 },
      expected: "Invalid negative capacity or 0",
    },
    {
      description: "negative bookingCount => not full with our logic",
      value: { classData: { MaxParticipants: 5 }, bookingCount: -1 },
      expected: undefined,
    },
    {
      description: "missing MaxParticipants property => not full",
      value: { classData: {}, bookingCount: 5 },
      expected: undefined,
    },
    {
      description: "MaxParticipants is negative ",
      value: { classData: { MaxParticipants: -1 }, bookingCount: 0 },
      expected: "Invalid negative capacity or 0",
    },
    {
      description:
        "classData is null => fail with 'Invalid class data (cannot be null)'",
      value: { classData: null, bookingCount: 5 },
      expected: "Invalid class data (cannot be null)",
    },
  ];

  describe.each(classFullProvider)("isClassFull tests", (scenario) => {
    it(`Given ${scenario.description}, expecting '${String(scenario.expected)}'`, () => {
      const { classData, bookingCount } = scenario.value;
      const result = isClassFull(classData, bookingCount);
      expect(result).toBe(scenario.expected);
    });
  });
});
