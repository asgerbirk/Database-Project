import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    //-------------------------------------------------------------
    //Load test -
    { duration: "30s", target: 200 }, // Ramp up to 200 users
    { duration: "5m", target: 200 }, // Sustain 200 users
    { duration: "30s", target: 0 }, // Ramp down

    //-------------------------------------------------------------
    //Stress test -

    { duration: "1m", target: 100 },
    { duration: "2m", target: 100 },

    { duration: "1m", target: 200 },
    { duration: "2m", target: 200 },

    { duration: "1m", target: 500 },
    { duration: "2m", target: 500 },

    { duration: "30s", target: 0 },

    //-------------------------------------------------------------

    //Spike test -
    //warm up
    { duration: "30s", target: 100 },

    //spike
    { duration: "1m", target: 1_500 },
    { duration: "10s", target: 1_500 },
    { duration: "1m", target: 100 },

    //cool down
    { duration: "30s", target: 0 },

    //-------------------------------------------------------------
  ],
  thresholds: {
    http_req_duration: ["p(95)<200"], // 95% of requests should complete within 200ms
    http_req_failed: ["rate<0.01"], // Less than 1% of requests should fail
  },
};

function testGetClasses() {
  const res = http.get("http://localhost:8080/classes");

  check(res, {
    "GET /classes - status is 200": (r) => r.status === 200,
    "GET /classes - classes returned": (r) => {
      const body = r.json();
      return Array.isArray(body) && body.length > 0;
    },
  });

  sleep(1); // Simulate user delay
}

function register() {
  const payload = JSON.stringify({
    email: `user${Math.floor(Math.random() * 10000)}@example.com`,
    // NOSONAR: This is test data and not used in production.

    password: process.env.TEST_PASSWORD || "password123",
    firstName: "Test",
    lastName: "User",
    phone: "123456789",
    address: "123 Test Street",
    dateOfBirth: "1990-01-01",
    membershipId: getRandomInt(1, 5), // Random membership ID for test purposes
    emergencyContact: "987654321",
  });

  const res = http.post("http://localhost:8080/register", payload, {
    headers: { "Content-Type": "application/json" },
  });

  check(res, {
    "POST /register - status is 201": (r) => r.status === 201,
  });

  sleep(1); // Simulate user delay
}

function testPostBookings() {
  const payload = JSON.stringify({
    ClassID: Math.ceil(Math.random() * 10),
    BookingDate: new Date().toISOString(),
    Status: "CONFIRMED",
    MemberID: Math.floor(Math.random() * (1027 - 52 + 1)),
  });

  const res = http.post("http://localhost:8080/bookings", payload, {
    headers: { "Content-Type": "application/json" },
  });

  if (res.status === 201) {
    console.log(`Booking created successfully: ${JSON.stringify(res.json())}`);
  } else if (res.status === 404) {
    console.warn(
      `Duplicate booking detected: MemberID ${memberID}, ClassID ${classID}`
    );
  } else {
    console.error(`Unexpected error: ${res.status} - ${res.body}`);
  }

  sleep(1); // Simulate user delay
}

export default function () {
  testPostBookings();
  register();
  testGetClasses();
}
