import { getDriver } from "../../databases/neo4j/neo4jConnection.js";
import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Function to create a session
function getSession() {
  const driver = getDriver();
  return driver.session();
}

router.post("/neo4j", async (req: Request, res: Response) => {
  const session = getSession();

  const {
    FirstName,
    LastName,
    Email,
    Password,
    EmergencyContact,
    JoinDate,
    MembershipID,
  } = req.body;

  try {
    //transaction - more write operations.
    const result = await session.executeWrite(async (tx) => {
      const PersonID = uuidv4();

      //Cypher query to create new person
      const personResult = await tx.run(
        `
        CREATE (p:Person {
          PersonID: $PersonID,
          FirstName: $FirstName,
          LastName: $LastName,
          Email: $Email,
          Password: $Password
          Role: $Role
        })
        RETURN p
        `,
        //passed parameters that replace $person
        {
          PersonID,
          FirstName,
          LastName,
          Email,
          Password,
          Role: "MEMBER",
        }
      );

      //checks if the person is created successfully
      if (personResult.records.length === 0) {
        throw new Error("Failed to create person");
      }

      const MemberID = uuidv4();
      const memberResult = await tx.run(
        //matches the person where the personid is equal to $personid. This make sure that we find the person that was created before.
        `
        MATCH (p:Person {PersonID: $PersonID})
        CREATE (m:Members {
          MemberID: $MemberID,
          PersonID: $PersonID
          JoinDate: $JoinDate,
          EmergencyContact: $EmergencyContact,
          MembershipID: $MembershipID
        })
        
        CREATE (p)-[:IS_MEMBER]->(m)
        RETURN m
        `,
        {
          PersonID,
          MemberID,
          JoinDate,
          EmergencyContact,
          MembershipID,
        }
      );

      if (memberResult.records.length === 0) {
        throw new Error("Failed to create member");
      }

      //returns the person and member object that was created
      return {
        PersonID: personResult.records[0].get("p").properties.PersonID,
        MemberID: memberResult.records[0].get("m").properties.MemberID,
      };
    });

    res.status(201).send({
      message: "Person created successfully.",
      PersonID: result.PersonID,
      MemberID: result.MemberID,
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .send({ error: "An error occurred while creating the person." });
  } finally {
    await session.close();
    console.log("Neo4j session closed.");
  }
});

router.get("/persons/neo4j", async (req: Request, res: Response) => {
  const session = getSession();

  try {
    const result = await session.executeRead(async (tx) => {
      const personsResult = await tx.run(`
        MATCH (p:Person)
        RETURN p
      `);

      // Transform the result into an array of person objects dynamically
      const persons = personsResult.records.map(
        (record) => record.get("p").properties
      );

      return persons;
    });

    // Send the response with the list of persons
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching persons:", error.message);
    res
      .status(500)
      .send({ error: "An error occurred while fetching persons." });
  } finally {
    await session.close();
    console.log("Neo4j session closed.");
  }
});

router.get("/neo4j/members", async (req: Request, res: Response) => {
  const session = getSession();

  try {
    const result = await session.executeRead(async (tx) => {
      const membersResult = await tx.run(`
        MATCH (m:Members)
        RETURN m
      `);

      // Transform the result into an array of member objects dynamically
      const members = membersResult.records.map(
        (record) => record.get("m").properties
      );

      return members;
    });

    // Send the response with the list of members
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching members:", error.message);
    res
      .status(500)
      .send({ error: "An error occurred while fetching members." });
  } finally {
    await session.close();
    console.log("Neo4j session closed.");
  }
});

export { router as NeoRouter };
