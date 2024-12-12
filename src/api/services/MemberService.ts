import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";
import { MongoDBConnection } from "../../databases/mongoDB/mongoConnection.js";

// Type definitions
type DatabaseStrategy = {
  getAll: () => Promise<any[] | { error: string }>;
  getById: (id: any) => Promise<any | { error: string }>;
};

// Prisma Database Strategy
const createPrismaMemberStrategy = (): DatabaseStrategy => {
  const prisma = new PrismaClient();

  return {
    getAll: async () => {
      try {
        return await prisma.members.findMany({
          include: {
            membership: true,
            person: true,
            memberBookings: true,
            payments: true,
          },
        });
      } catch (error) {
        return { error: "Failed to get members" };
      }
    },

    getById: async (id: any) => {
      try {
        const member = await prisma.members.findUnique({
          where: { PersonID: parseInt(id.id) },
          include: {
            membership: true,
            person: true,
            memberBookings: true,
            payments: true,
          },
        });

        if (!member) {
          return { error: "Member not found" };
        }
        return member;
      } catch (error) {
        console.error(error);
        return { error: "Failed to get member" };
      }
    },
  };
};

// MongoDB Database Strategy
const createMongoMemberStrategy = (
  collectionName: string = "members"
): DatabaseStrategy => {
  const getCollection = async () => {
    return MongoDBConnection.getCollection(collectionName);
  };

  return {
    getAll: async () => {
      try {
        const collection = await getCollection();
        return await collection.find({}).toArray();
      } catch (error) {
        console.error(error);
        return { error: "Failed to retrieve members" };
      }
    },

    getById: async (id: any) => {
      try {
        const collection = await getCollection();
        const member = await collection.findOne({ _id: new ObjectId(id) });

        if (!member) {
          return { error: "Member not found" };
        }

        return member;
      } catch (error) {
        console.error(error);
        return { error: "Failed to retrieve member" };
      }
    },
  };
};

// Member Service Factory Function
export const createMemberService = (dbType: "sql" | "mongo") => {
  const strategy =
    dbType === "sql"
      ? createPrismaMemberStrategy()
      : dbType === "mongo"
      ? createMongoMemberStrategy()
      : (() => {
          throw new Error("Invalid database type");
        })();

  return {
    getAll: () => strategy.getAll(),
    getById: (id: any) => strategy.getById(id),
  };
};

export default createMemberService;
