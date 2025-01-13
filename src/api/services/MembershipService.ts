import { MembershipInput } from "../../types/input-types/MembershipInput.js";
import { PrismaClient } from "@prisma/client";
import { MongoDBConnection } from "../../databases/mongoDB/mongoConnection.js";
import { ObjectId } from "mongodb";
import { validatePricePerMonth } from "../helpers/Validator.js";

type DatabaseStrategy<T> = {
  getAll: () => Promise<any[] | { error: string }>;
  getById: (id: any) => Promise<any | { error: string }>;
  add?: (item: T) => Promise<any | { error: string }>;
  update?: (id: any, item: T) => Promise<any | { error: string }>;
  delete?: (id: any) => Promise<any | { error: string }>;
};

const createPrismaMembershipStrategy =
  (): DatabaseStrategy<MembershipInput> => {
    const prisma = new PrismaClient();

    return {
      getAll: async () => {
        try {
          return await prisma.memberships.findMany({});
        } catch (error) {
          console.error(error);
          return { error: "Failed to retrieve memberships" };
        }
      },

      getById: async (id: any) => {
        try {
          const membership = await prisma.memberships.findUnique({
            where: { MembershipID: parseInt(id.id) },
          });

          if (!membership) {
            return { error: "Membership not found" };
          }

          return membership;
        } catch (error) {
          console.error(error);
          return { error: "Failed to retrieve membership" };
        }
      },

      add: async (membership: MembershipInput) => {
        const {
          MembershipName,
          PricePerMonth,
          AccessLevel,
          Duration,
          MaxClassBookings,
          Description,
        } = membership;

        try {
          const validatedPricePerMonth = validatePricePerMonth(PricePerMonth);

          if (validatedPricePerMonth === 0 && PricePerMonth !== 0) {
            return { success: false, error: "Invalid PricePerMonth provided." };
          }
          const formattedPrice = validatedPricePerMonth.toFixed(2);

          return await prisma.memberships.create({
            data: {
              MembershipName,
              PricePerMonth: Number(formattedPrice),
              AccessLevel,
              Duration,
              MaxClassBookings,
              Description,
            },
          });
        } catch (error) {
          console.error(error);
          return { error: "Failed to create membership" };
        }
      },

      update: async (id: any, membership: MembershipInput) => {
        const {
          MembershipName,
          PricePerMonth,
          AccessLevel,
          MaxClassBookings,
          Description,
        } = membership;
        try {
          const res = await prisma.memberships.update({
            where: { MembershipID: parseInt(id.id) },
            data: {
              MembershipName,
              PricePerMonth,
              AccessLevel,
              MaxClassBookings,
              Description,
            },
          });
          console.log(res);
          return res;
        } catch (error) {
          console.error(error);
          return { error: "Failed to update Membership" };
        }
      },

      delete: async (id: any) => {
        try {
          return await prisma.memberships.delete({
            where: { MembershipID: parseInt(id.id) },
          });
        } catch (error) {
          console.error(error);
          return { error: "Failed to delete Membership" };
        }
      },
    };
  };

const createMongoMembershipStrategy = (
  collectionName: string = "memberships"
): DatabaseStrategy<MembershipInput> => {
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
        return { error: "Failed to retrieve memberships" };
      }
    },

    getById: async (id: any) => {
      try {
        const collection = await getCollection();
        const membership = await collection.findOne({ _id: new ObjectId(id) });

        if (!membership) {
          return { error: "Membership not found" };
        }

        return membership;
      } catch (error) {
        console.error(error);
        return { error: "Failed to retrieve membership" };
      }
    },

    add: async (membership: MembershipInput) => {
      try {
        const collection = await getCollection();
        const result = await collection.insertOne(membership);
        return result.insertedId;
      } catch (error) {
        console.error(error);
        return { error: "Failed to create membership" };
      }
    },

    update: async (id: any, membership: MembershipInput) => {
      try {
        const collection = await getCollection();
        return await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: membership }
        );
      } catch (error) {
        console.error(error);
        return { error: "Failed to update Membership" };
      }
    },

    delete: async (id: any) => {
      try {
        const collection = await getCollection();
        return await collection.deleteOne({ _id: new ObjectId(id) });
      } catch (error) {
        console.error(error);
        return { error: "Failed to delete Membership" };
      }
    },
  };
};
export const createMembershipService = (dbType: "sql" | "mongo") => {
  const strategy =
    dbType === "sql"
      ? createPrismaMembershipStrategy()
      : dbType === "mongo"
        ? createMongoMembershipStrategy()
        : (() => {
            throw new Error("Invalid database type");
          })();

  return {
    getAll: () => strategy.getAll(),
    getById: (id: any) => strategy.getById(id),
    add: (membership: MembershipInput) => strategy.add!(membership),
    update: (id: any, membership: MembershipInput) =>
      strategy.update!(id, membership),
    delete: (id: any) => strategy.delete!(id),
  };
};
