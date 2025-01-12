// helpers/testFunctions.js
import http from "k6/http";
import { check, sleep } from "k6";

export function testGetClasses() {
  const res = http.get("http://localhost:8080/classes");
  check(res, { "GET /classes is 200": (r) => r.status === 200 });
  sleep(1);
}

export function testPostBookings() {
  const payload = JSON.stringify({
    ClassID: Math.ceil(Math.random() * 10),
    BookingDate: new Date().toISOString().split("T")[0], // Just date if needed
    Status: "CONFIRMED",
    MemberID: Math.ceil(Math.random() * 501) + 51,
  });
  const res = http.post("http://localhost:8080/bookings", payload, {
    headers: { "Content-Type": "application/json" },
  });
  if (res.status === 201) {
    console.log(`Booking created successfully: ${JSON.stringify(res.json())}`);
  } else {
    console.error(`Unexpected error: ${res.status} - ${res.body}`);
  }
  sleep(1);
}

export function register() {
  const payload = JSON.stringify({
    email: `user${Math.floor(Math.random() * 10000)}@example.com`,
    password: "password123",
    firstName: "Test",
    lastName: "User",
    phone: "123456789",
    address: "123 Test Street",
    dateOfBirth: "1990-01-01",
    membershipId: Math.ceil(Math.random() * 2),
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
