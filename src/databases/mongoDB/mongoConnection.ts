import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in the .env file");
}

const client = new MongoClient(uri);

async function mongodbConnect() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("zando-fitness");
    console.log("Database Name:", db.databaseName);
    return client.db();
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}

export { mongodbConnect, client };
