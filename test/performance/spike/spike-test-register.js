import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    //warm up
    { duration: "30s", target: 100 },

    //spike
    { duration: "1m", target: 1_500 },
    { duration: "10s", target: 1_500 },
    { duration: "1m", target: 100 },

    //cool down
    { duration: "30s", target: 0 },
  ],
  /*
  thresholds: {
    http_req_duration: ["p(95)<200"], // 95% of requests should complete within 200ms
    http_req_failed: ["rate<0.01"], // Less than 1% of requests should fail
  },
  */
};

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

export default function () {
  register();
}
