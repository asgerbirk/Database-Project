import { register, testGetClasses, testPostBookings } from "./functions.js";

export const options = {
  stages: [
    // Warm up
    { duration: "30s", target: 100 },
    // Spike
    { duration: "1m", target: 1500 },
    { duration: "10s", target: 1500 },
    // Scale back down
    { duration: "1m", target: 100 },
    { duration: "30s", target: 0 },
  ],
};

export default function () {
  testGetClasses();
  testPostBookings();
  register();
}
