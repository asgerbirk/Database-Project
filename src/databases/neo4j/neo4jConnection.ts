import neo4j, { Driver, Session } from "neo4j-driver";

export async function connectToDatabase() {
  const neo4jUri: string = process.env.NEO4J_URI as string;
  const password = process.env.NEO4J_PASSWORD as string;
  const username = process.env.NEO4J_USERNAME as string;

  if (!neo4jUri || !username || !password) {
    throw new Error("Missing Neo4j configuration in environment variables");
  }
  let driver;

  try {
    driver = neo4j.driver(neo4jUri, neo4j.auth.basic(username, password));
    const serverInfo = await driver.getServerInfo();
    console.log("Connection established");
    console.log(serverInfo);
  } catch (err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`);
    await driver.close();
    return;
  }
  await driver.close;
}

/*
const driver: Driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic(username, password)
);

export const getSession = (): Session => driver.session();
export const closeSession = async () => await driver.close();
*/
