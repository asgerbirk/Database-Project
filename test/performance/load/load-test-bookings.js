import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 200 }, // Ramp up to 200 users
    { duration: "5m", target: 200 }, // Sustain 200 users
    { duration: "30s", target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<200"], // 95% of requests should complete within 200ms
    http_req_failed: ["rate<0.01"], // Less than 1% of requests should fail
  },
};

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
}
