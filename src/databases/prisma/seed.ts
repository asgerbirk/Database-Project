import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding the database...");

  // Insert 1000 Persons and Members using transactions
  for (let i = 3; i <= 1002; i++) {
    try {
      await prisma.$transaction(async (prisma) => {
        // Create Person
        const person = await prisma.person.create({
          data: {
            FirstName: `Member${i}`,
            LastName: `Test${i}`,
            Email: `member${i}@example.com`,
            Password: `hashed_password`,
            Phone: `123456789${i % 10}`,
            Address: `Address ${i}`,
            DateOfBirth: new Date(`19${70 + (i % 30)}-01-01`),
            Role: "MEMBER",
          },
        });

        // Create Member using the PersonID
        await prisma.members.create({
          data: {
            PersonID: person.PersonID,
            JoinDate: new Date(),
            MembershipID: i % 2 === 0 ? 1 : 2, // Alternate memberships
            EmergencyContact: `Emergency ${i}`,
          },
        });
      });

      console.log(`Inserted Person and Member ${i}`);
    } catch (error) {
      console.error(`Failed to insert Person and Member ${i}:`, error);
    }
  }

  console.log("Inserted 1000 members.");
}

main()
  .then(async () => {
    console.log("Seeding complete.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Error seeding database:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
