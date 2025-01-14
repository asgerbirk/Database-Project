import express from "express";

import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/config/swaggerConfig.js";
import { EmployeeRouter } from "./src/api/routes/EmployeeRouter.js";
import { MembershipRouter } from "./src/api/routes/MembershipRouter.js";
import { ProductRouter } from "./src/api/routes/ProductRouter.js";
import cors from "cors";
import { AuthenticationRouter } from "./src/api/routes/AuthenticationRouter.js";
import { MemberRouter } from "./src/api/routes/MemberRouter.js";
import { BookingRouter } from "./src/api/routes/BookingRouter.js";
import { ClassesRouter } from "./src/api/routes/ClassRouter.js";
import cookieParser from "cookie-parser";

const app = express();

/*
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    `
    default-src 'self'; 
    script-src 'self'; 
    style-src 'self'; 
    img-src 'self' data:; 
    object-src 'none'; 
    base-uri 'self'; 
    form-action 'self'; 
    upgrade-insecure-requests; 
    block-all-mixed-content;
    `.trim()
  );
  next();
});
*/

app.use(cookieParser()); // MUST come before any middleware that accesses cookies

// Middleware to parse incoming JSON requests
// Makes JSON payload data available in `req.body`
app.use(express.json());

// handle sform data
app.use(express.urlencoded({ extended: true }));

// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

app.use(
  EmployeeRouter,
  MemberRouter,
  MembershipRouter,
  ProductRouter,
  AuthenticationRouter,
  BookingRouter,
  ClassesRouter
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(
    `Swagger docs are available at http://localhost:${PORT}/api-docs`
  );
});
