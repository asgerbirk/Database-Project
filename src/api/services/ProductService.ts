import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";
import { ProductInput } from "../../types/input-types/ProductInput.js";
import { MongoDBConnection } from "../../databases/mongoDB/mongoConnection.js";

// Shared type definitions
type DatabaseStrategy<T> = {
  getAll: () => Promise<any[] | { error: string }>;
  getById: (id: any) => Promise<any | { error: string }>;
  add?: (item: T) => Promise<any | { error: string }>;
  update?: (id: any, item: T) => Promise<any | { error: string }>;
  delete?: (id: any) => Promise<any | { error: string }>;
};

// Product Service
const createPrismaProductStrategy = (): DatabaseStrategy<ProductInput> => {
  const prisma = new PrismaClient();

  return {
    getAll: async () => {
      try {
        return await prisma.products.findMany({});
      } catch (error) {
        console.error(error);
        return { error: "Failed to retrieve products" };
      }
    },

    getById: async (id: any) => {
      try {
        const product = await prisma.products.findUnique({
          where: { ProductID: parseInt(id) },
        });

        if (!product) {
          return { error: "Product not found" };
        }

        return product;
      } catch (error) {
        console.error(error);
        return { error: "Failed to retrieve product" };
      }
    },

    add: async (product: ProductInput) => {
      const {
        ProductName,
        Description,
        Price,
        StockQuantity,
        CategoryID,
      } = product;

      try {
        return await prisma.products.create({
          data: {
            ProductName,
            Description,
            Price,
            StockQuantity,
            CategoryID,
          },
        });
      } catch (error) {
        console.error(error);
        return { error: "Failed to create product" };
      }
    },

    update: async (id: any, product: ProductInput) => {
      const {
        ProductName,
        Description,
        Price,
        StockQuantity,
        CategoryID,
      } = product;

      try {
        return await prisma.products.update({
          where: { ProductID: parseInt(id) },
          data: {
            ProductName,
            Description,
            Price,
            StockQuantity,
            CategoryID,
          },
        });
      } catch (error) {
        console.error(error);
        return { error: "Failed to update Product" };
      }
    },

    delete: async (id: any) => {
      try {
        return await prisma.products.delete({
          where: { ProductID: parseInt(id) },
        });
      } catch (error) {
        console.error(error);
        return { error: "Failed to delete Product" };
      }
    },
  };
};

const createMongoProductStrategy = (collectionName: string = 'products'): DatabaseStrategy<ProductInput> => {
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
        return { error: "Failed to retrieve products" };
      }
    },

    getById: async (id: any) => {
      try {
        const collection = await getCollection();
        const product = await collection.findOne({ _id: new ObjectId(id) });

        if (!product) {
          return { error: "Product not found" };
        }

        return product;
      } catch (error) {
        console.error(error);
        return { error: "Failed to retrieve product" };
      }
    },

    add: async (product: ProductInput) => {
      try {
        const collection = await getCollection();
        const result = await collection.insertOne(product);
        return result.insertedId;
      } catch (error) {
        console.error(error);
        return { error: "Failed to create product" };
      }
    },

    update: async (id: any, product: ProductInput) => {
      try {
        const collection = await getCollection();
        return await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: product }
        );
      } catch (error) {
        console.error(error);
        return { error: "Failed to update Product" };
      }
    },

    delete: async (id: any) => {
      try {
        const collection = await getCollection();
        return await collection.deleteOne({ _id: new ObjectId(id) });
      } catch (error) {
        console.error(error);
        return { error: "Failed to delete Product" };
      }
    },
  };
};


export const createProductService = (dbType: 'sql' | 'mongo') => {
  const strategy = dbType === 'sql'
      ? createPrismaProductStrategy()
      : dbType === 'mongo'
          ? createMongoProductStrategy()
          : (() => { throw new Error('Invalid database type'); })();

  return {
    getAll: () => strategy.getAll(),
    getById: (id: any) => strategy.getById(id),
    add: (product: ProductInput) => strategy.add!(product),
    update: (id: any, product: ProductInput) => strategy.update!(id, product),
    delete: (id: any) => strategy.delete!(id),
  };
};
