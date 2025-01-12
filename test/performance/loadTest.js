import { register, testGetClasses, testPostBookings } from "./functions.js";

export const options = {
  stages: [
    { duration: "30s", target: 200 }, // Ramp up to 200 users
    { duration: "5m", target: 200 }, // Sustain 200 users
    { duration: "30s", target: 0 }, // Ramp down
  ],
};

export default function () {
  testGetClasses();
  //testPostBookings();
  //register();
}
