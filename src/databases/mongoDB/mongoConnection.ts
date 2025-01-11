import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is not defined in the .env file");
}

export class MongoDBConnection {
  private static client: MongoClient | null = null;
  private static db: Db | null = null;

  // Configuration options for MongoClient
  private static clientOptions = {
    tls: true,
    serverSelectionTimeoutMS: 3000,
    autoSelectFamily: false,
  };

  public static async connect(): Promise<Db> {
    if (!this.client) {
      try {
        this.client = new MongoClient(uri, this.clientOptions);
        await this.client.connect();
        console.log("Connected to MongoDB");

        this.db = this.client.db("zando-fitness");
        console.log("Database Name:", this.db.databaseName);
      } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        throw error;
      }
    }
    return this.db!;
  }

  public static async getCollection(collectionName: string) {
    const db = await this.connect();
    return db.collection(collectionName);
  }

  public static async disconnect(): Promise<void> {
    if (this.client) {
      try {
        await this.client.close();
        console.log("Disconnected from MongoDB");
      } catch (error) {
        console.error("Error while disconnecting from MongoDB", error);
        throw error;
      } finally {
        this.client = null;
        this.db = null;
      }
    }
  }
}
