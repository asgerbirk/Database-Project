import { getDriver } from "../../databases/neo4j/neo4jConnection.js";
import express, { Request, Response } from "express";

const router = express.Router();

// Helper function to create a session
function getSession() {
  const driver = getDriver();
  return driver.session();
}

router.get("/neo4j", async (req: Request, res: Response) => {
  const session = getSession();

  try {
    console.log("Executing Neo4j query...");
    const query = "MATCH (e:Employee) RETURN e.FirstName AS FirstName;";
    const result = await session.run(query);

    // Transform results to an array of plain objects

    console.log("Query results:", result);

    // Send the response with the results
    res.status(200).json(result);
  } catch (error) {
    console.error("Error executing Neo4j query:", error);
    res.status(500).send({ error: "An error occurred while querying Neo4j." });
  } finally {
    await session.close();
    console.log("Neo4j session closed.");
  }
});

export { router as NeoRouter };
