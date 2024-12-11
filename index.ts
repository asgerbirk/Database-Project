import express from "express";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/config/swaggerConfig.js";
import { EmployeeRouter } from "./src/api/routes/EmployeeRouter.js";
import { connectToDatabase } from "./src/databases/neo4j/neo4jConnection.js";
// import { mongodbConnect } from "./src/databases/mongoDB/mongoConnection.js";
import { MembershipRouter } from "./src/api/routes/MembershipRouter.js";
import { ProductRouter } from "./src/api/routes/ProductRouter.js";
import cors from "cors";
import { AuthenticationRouter } from "./src/api/routes/AuthenticationRouter.js";
import { NeoRouter } from "./src/api/routes/Neo4j.js";
import { MemberRouter } from "./src/api/routes/MemberRouter.js";

const app = express();

app.use(express.json());
app.use(cors());
//connectToDatabase();

app.use(
  EmployeeRouter,
  MemberRouter,
  MembershipRouter,
  ProductRouter,
  AuthenticationRouter,
  NeoRouter
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
