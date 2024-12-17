import neo4j, { Driver } from "neo4j-driver";

let driver: Driver | null = null;

export async function connectToDatabase() {
  const neo4jUri: string = process.env.NEO4J_URI as string;
  const password = process.env.NEO4J_PASSWORD as string;
  const username = process.env.NEO4J_USERNAME as string;

  if (!neo4jUri || !username || !password) {
    throw new Error("Missing Neo4j configuration in environment variables");
  }

  try {
    driver = neo4j.driver(neo4jUri, neo4j.auth.basic(username, password));
    const serverInfo = await driver.getServerInfo();
    console.log("Connection established");
    console.log(serverInfo);
  } catch (err) {
    console.error("Connection error:", err);
    if (driver) await driver.close();
    throw err;
  }
}

// Export the driver for use in other files
export function getDriver(): Driver {
  if (!driver) {
    throw new Error("Driver not initialized. Call connectToDatabase() first.");
  }
  return driver;
}
