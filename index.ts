import express from "express";
import helmet from "helmet";

import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/config/swaggerConfig.js";
import { EmployeeRouter } from "./src/api/routes/EmployeeRouter.js";
// import { connectToDatabase } from "./src/databases/neo4j/neo4jConnection.js";
// import { mongodbConnect } from "./src/databases/mongoDB/mongoConnection.js";
import { MembershipRouter } from "./src/api/routes/MembershipRouter.js";
import { ProductRouter } from "./src/api/routes/ProductRouter.js";
import cors from "cors";
import { AuthenticationRouter } from "./src/api/routes/AuthenticationRouter.js";
// import { NeoRouter } from "./src/api/routes/Neo4j.js";
import { MemberRouter } from "./src/api/routes/MemberRouter.js";
import { BookingRouter } from "./src/api/routes/BookingRouter.js";
import { ClassesRouter } from "./src/api/routes/ClassRouter.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser()); // MUST come before any middleware that accesses cookies

// Middleware to set security-related HTTP headers
// Helps prevent common vulnerabilities like XSS
app.use(helmet());

// Middleware to parse incoming JSON requests
// Makes JSON payload data available in `req.body`
app.use(express.json());

// handle sform data
app.use(express.urlencoded({ extended: true }));

// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
//connectToDatabase();

app.use(
  EmployeeRouter,
  MemberRouter,
  MembershipRouter,
  ProductRouter,
  AuthenticationRouter,
  // NeoRouter,
  BookingRouter,
  ClassesRouter
);

//mongodbConnect();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(
    `Swagger docs are available at http://localhost:${PORT}/api-docs`
  );
});
