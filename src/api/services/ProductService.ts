import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";
import { ProductInput } from "../../types/input-types/ProductInput.js";
import { MongoDBConnection } from "../../databases/mongoDB/mongoConnection.js"; // Adjust the import path as needed

// Define an interface for the database strategy
interface ProductRepository {
  getAll(): Promise<any[] | { error: string }>;
  getById(id: string): Promise<any | { error: string }>;
  add(product: ProductInput): Promise<any | { error: string }>;
  update(id: string, product: ProductInput): Promise<any | { error: string }>;
  delete(id: string): Promise<any | { error: string }>;
}

// SQL Strategy using Prisma
class PrismaProductRepository implements ProductRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAll() {
    try {
      const products = await this.prisma.products.findMany({});
      return products;
    } catch (error) {
      console.error(error);
      return { error: "Failed to retrieve products" };
    }
  }

  async getById(id: string) {
    try {
      const product = await this.prisma.products.findUnique({
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
  }

  async add(product: ProductInput) {
    const {
      ProductName,
      Description,
      Price,
      StockQuantity,
      CategoryID,
    } = product;

    try {
      const newProduct = await this.prisma.products.create({
        data: {
          ProductName,
          Description,
          Price,
          StockQuantity,
          CategoryID,
        },
      });

      return newProduct;
    } catch (error) {
      console.error(error);
      return { error: "Failed to create product" };
    }
  }

  async update(id: string, product: ProductInput) {
    const {
      ProductName,
      Description,
      Price,
      StockQuantity,
      CategoryID,
    } = product;

    try {
      const updatedProduct = await this.prisma.products.update({
        where: { ProductID: parseInt(id) },
        data: {
          ProductName,
          Description,
          Price,
          StockQuantity,
          CategoryID,
        },
      });
      return updatedProduct;
    } catch (error) {
      console.error(error);
      return { error: "Failed to update Product" };
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.products.delete({
        where: { ProductID: parseInt(id) },
      });
    } catch (error) {
      console.error(error);
      return { error: "Failed to delete Product" };
    }
  }
}

// MongoDB Strategy
class MongoProductRepository implements ProductRepository {
  private collectionName: string;

  constructor(collectionName: string = 'products') {
    this.collectionName = collectionName;
  }

  private async getCollection() {
    return MongoDBConnection.getCollection(this.collectionName);
  }

  async getAll() {
    try {
      const collection = await this.getCollection();
      const products = await collection.find({}).toArray();
      return products;
    } catch (error) {
      console.error(error);
      return { error: "Failed to retrieve products" };
    }
  }

  async getById(id: string) {
    try {
      const collection = await this.getCollection();
      const product = await collection.findOne({ _id: new ObjectId(id) });

      if (!product) {
        return { error: "Product not found" };
      }

      return product;
    } catch (error) {
      console.error(error);
      return { error: "Failed to retrieve product" };
    }
  }

  async add(product: ProductInput) {
    try {
      const collection = await this.getCollection();
      const result = await collection.insertOne(product);
      return result.insertedId;
    } catch (error) {
      console.error(error);
      return { error: "Failed to create product" };
    }
  }

  async update(id: string, product: ProductInput) {
    try {
      const collection = await this.getCollection();
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: product }
      );
      return result;
    } catch (error) {
      console.error(error);
      return { error: "Failed to update Product" };
    }
  }

  async delete(id: string) {
    try {
      const collection = await this.getCollection();
      return await collection.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error(error);
      return { error: "Failed to delete Product" };
    }
  }
}

// Product Service Factory
export class ProductService {
  private repository: ProductRepository;

  constructor(dbType: 'sql' | 'mongo') {
    if (dbType === 'sql') {
      this.repository = new PrismaProductRepository();
    } else if (dbType === 'mongo') {
      this.repository = new MongoProductRepository();
    } else {
      throw new Error('Invalid database type');
    }
  }

  async getAll() {
    return this.repository.getAll();
  }

  async getById(id: any ) {
    return this.repository.getById(id);
  }

  async add(product: ProductInput) {
    return this.repository.add(product);
  }

  async update(id: string , product: ProductInput) {
    return this.repository.update(id, product);
  }

  async delete(id: any ) {
    return this.repository.delete(id);
  }
}

export default ProductService;