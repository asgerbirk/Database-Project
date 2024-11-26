import { PrismaClient } from "@prisma/client";
import { MembershipInput } from "../../types/input-types/MembershipInput.js";
import { MongoClient, ObjectId } from "mongodb";
import { MongoDBConnection } from "../../databases/mongoDB/mongoConnection.js"; // Adjust path as needed

// Define an interface for the database strategy
interface MembershipRepository {
  getAll(): Promise<any[] | { error: string }>;
  getById(id: any): Promise<any | { error: string }>;
  add(membership: MembershipInput): Promise<any | { error: string }>;
  update(membership: MembershipInput, id: any): Promise<any | { error: string }>;
  delete(id: any): Promise<any | { error: string }>;
}

// SQL Strategy using Prisma
class PrismaMembershipRepository implements MembershipRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAll() {
    try {
      const memberships = await this.prisma.memberships.findMany({});
      return memberships;
    } catch (error) {
      console.error(error);
      return { error: "Failed to retrieve memberships" };
    }
  }

  async getById(id: any) {
    try {
      const membership = await this.prisma.memberships.findUnique({
        where: { MembershipID: parseInt(id) },
      });
  
      if (!membership) {
        return { error: "Membership not found" };
      }
  
      return membership;
    } catch (error) {
      console.error(error);
      return { error: "Failed to retrieve membership" };
    }
  }

  async add(membership: MembershipInput) {
    const {
      MembershipName,
      PricePerMonth,
      AccessLevel,
      Duration,
      MaxClassBookings,
      Description,
    } = membership;
    
    try {
      const newMembership = await this.prisma.memberships.create({
        data: {
          MembershipName,
          PricePerMonth,
          AccessLevel,
          Duration,
          MaxClassBookings,
          Description,
        },
      });
  
      return newMembership;
    } catch (error) {
      console.error(error);
      return { error: "Failed to create membership" };
    }
  }

  async update(membership: MembershipInput, id: any) {
    const {
      MembershipName,
      PricePerMonth,
      AccessLevel,
      Duration,
      MaxClassBookings,
      Description 
    } = membership;

    try {
      const updatedMembership = await this.prisma.memberships.update({
        where: { MembershipID: parseInt(id) },
        data: {
          MembershipName,
          PricePerMonth,
          AccessLevel,
          Duration,
          MaxClassBookings,
          Description 
        },
      });
      return updatedMembership;
    } catch (error) {
      console.error(error);
      return { error: "Failed to update Membership" };
    }
  }

  async delete(id: any) {
    try {
      return await this.prisma.memberships.delete({
        where: { MembershipID: parseInt(id) },
      });
    } catch (error) {
      console.error(error);
      return { error: "Failed to delete Membership" };
    }
  }
}

// MongoDB Strategy
class MongoMembershipRepository implements MembershipRepository {
  private collectionName: string;

  constructor(collectionName: string = 'memberships') {
    this.collectionName = collectionName;
  }

  private async getCollection() {
    return MongoDBConnection.getCollection(this.collectionName);
  }

  async getAll() {
    try {
      const collection = await this.getCollection();
      const memberships = await collection.find({}).toArray();
      return memberships;
    } catch (error) {
      console.error(error);
      return { error: "Failed to retrieve memberships" };
    }
  }

  async getById(id: any) {
    try {
      const collection = await this.getCollection();
      const membership = await collection.findOne({ _id: new ObjectId(id) });

      if (!membership) {
        return { error: "Membership not found" };
      }

      return membership;
    } catch (error) {
      console.error(error);
      return { error: "Failed to retrieve membership" };
    }
  }

  async add(membership: MembershipInput) {
    try {
      const collection = await this.getCollection();
      const result = await collection.insertOne(membership);
      return result.insertedId;
    } catch (error) {
      console.error(error);
      return { error: "Failed to create membership" };
    }
  }

  async update(membership: MembershipInput, id: any) {
    try {
      const collection = await this.getCollection();
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: membership }
      );
      return result;
    } catch (error) {
      console.error(error);
      return { error: "Failed to update Membership" };
    }
  }

  async delete(id: any) {
    try {
      const collection = await this.getCollection();
      return await collection.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error(error);
      return { error: "Failed to delete Membership" };
    }
  }
}

// Membership Service Factory
export class MembershipService {
  private repository: MembershipRepository;

  constructor(dbType: 'sql' | 'mongo') {
    if (dbType === 'sql') {
      this.repository = new PrismaMembershipRepository();
    } else if (dbType === 'mongo') {
      this.repository = new MongoMembershipRepository();
    } else {
      throw new Error('Invalid database type');
    }
  }

  async getAll() {
    return this.repository.getAll();
  }

  async getById(id: any) {
    return this.repository.getById(id);
  }

  async add(membership: MembershipInput) {
    return this.repository.add(membership);
  }

  async update(id: any, membership: MembershipInput) {
    return this.repository.update(membership, id);
  }

  async delete(id: any) {
    return this.repository.delete(id);
  }
}

export default MembershipService;