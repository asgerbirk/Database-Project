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

export default function () {
  testGetClasses();
}
