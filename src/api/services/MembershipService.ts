import { PrismaClient } from "@prisma/client";
import { MembershipInput } from "../../types/input-types/MembershipInput.js";


const prisma = new PrismaClient();

export async function getAll() {
    try {
        const memberships = await prisma.memberships.findMany({});
        return(memberships);
      } catch (error) {
        console.error(error);
        return({ error: "Failed to retrieve memberships" });
      }
}

export async function getById(id: any) {
    try {
        const membership = await prisma.memberships.findUnique({
          where: { MembershipID: parseInt(id) },
        });
  
        if (!membership) {
          return({ error: "Membership not found" });
        }
  
        return(membership);
      } catch (error) {
        console.error(error);
        return({ error: "Failed to retrieve membership" });
      }
}

export async function Add(membership: MembershipInput) {
    const {
        MembershipName,
        PricePerMonth,
        AccessLevel,
        Duration,
        MaxClassBookings,
        Description,
      } = membership;
    
      try {
        const newMembership = await prisma.memberships.create({
          data: {
            MembershipName,
            PricePerMonth,
            AccessLevel,
            Duration,
            MaxClassBookings,
            Description,
          },
        });
    
        return(newMembership);
      } catch (error) {
        console.error(error);
        return({ error: "Failed to create membership" });
      }
}

export async function Update(membership: MembershipInput, id: string) {
    const {MembershipName,
      PricePerMonth,
      AccessLevel,
      Duration,
      MaxClassBookings,
      Description } =
        membership
    try {
        const updatedMembership = await prisma.memberships.update({
            where: { MembershipID: parseInt(id) },
            data: { MembershipName,
              PricePerMonth,
              AccessLevel,
              Duration,
              MaxClassBookings,
              Description },
        });
        return (updatedMembership);
    } catch (error) {
        console.error(error);
        return ({ error: "Failed to update Membership" });
    }
}

export async function Delete(id: any) {
    try {
        return await prisma.memberships.delete({
            where: { MembershipID: parseInt(id) },
        });
    } catch (error) {
        console.error(error);
        return ({ error: "Failed to delete Membership" });
    }
}


