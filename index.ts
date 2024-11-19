import express from "express";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/config/swaggerConfig.js";
import { EmployeeRouter } from "./src/api/routes/EmployeeRouter.js";
import { connectToDatabase } from "./src/databases/neo4j/neo4jConnection.js";
import { mongodbConnect } from "./src/databases/mongoDB/mongoConnection.js";

const app = express();


app.use(express.json());
app.use(EmployeeRouter);
connectToDatabase();
mongodbConnect();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(
    `Swagger docs are available at http://localhost:${PORT}/api-docs`
  );
});