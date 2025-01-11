import { register, testGetClasses, testPostBookings } from "./functions.js";

export const options = {
  stages: [
    // Ramp up
    { duration: "1m", target: 100 },
    { duration: "2m", target: 100 },

    // Further ramp up
    { duration: "1m", target: 200 },
    { duration: "2m", target: 200 },

    // Even more
    { duration: "1m", target: 500 },
    { duration: "2m", target: 500 },

    // Ramp down
    { duration: "30s", target: 0 },
  ],
};

export default function () {
  testGetClasses();
  testPostBookings();
  register();
}
