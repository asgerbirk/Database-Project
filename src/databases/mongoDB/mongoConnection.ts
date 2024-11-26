import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in the .env file");
}

export class MongoDBConnection {
  private static instance: MongoClient;
  private static db: Db;

  private constructor() {}

  public static async connect(): Promise<Db> {
    if (!this.instance) {
      try {
        this.instance = new MongoClient(uri);
        await this.instance.connect();
        console.log('Connected to MongoDB');
        
        this.db = this.instance.db('zando-fitness');
        console.log('Database Name:', this.db.databaseName);
        
        return this.db;
      } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        throw error;
      }
    }
    return this.db;
  }

  public static async getCollection(collectionName: string) {
    const db = await this.connect();
    return db.collection(collectionName);
  }

  public static async disconnect() {
    if (this.instance) {
      await this.instance.close();
      this.instance = null;
      this.db = null;
    }
  }
}