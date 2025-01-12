import { describe, it, expect, afterEach } from "vitest";
import { createClassService } from "../../src/api/services/ClassService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Class Service - Integration Tests", () => {
  const classService = createClassService();

  // Testdata
  const sampleClass = {
    ClassName: "Yoga",
    Description: "A relaxing yoga session",
    ClassType: "Fitness",
    Duration: 60,
    MaxParticipants: 20,
    EmployeeID: 1,
    CenterID: 1,
    ScheduleDate: "2025-01-15",
    StartTime: "08:00", // Justeret til UTC
    EndTime: "09:00",   // Justeret til UTC
  };

  // Liste over oprettede klasser til oprydning
  const createdClassIds: number[] = [];

  const parseClassData = (classData: any) => {
    const toDate = (value: any) => (value instanceof Date ? value : new Date(value));
    const formatTime = (time: string | Date) => {
      const date = toDate(time);
      const hours = date.getHours().toString().padStart(2, "0"); // Lokal tid
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };
  
    return {
      ...classData,
      ScheduleDate: toDate(classData.ScheduleDate).toISOString().split("T")[0], // 'YYYY-MM-DD'
      StartTime: formatTime(classData.StartTime),                               // Lokal tid
      EndTime: formatTime(classData.EndTime),                                   // Lokal tid
    };
  };

  // Ryd op efter hver test
  afterEach(async () => {
    for (const classId of createdClassIds) {
      try {
        await prisma.classes.delete({
          where: { ClassID: classId },
        });
      } catch (error) {
        console.error(`Error cleaning up class with ID ${classId}:`, error);
      }
    }
    createdClassIds.length = 0; // Tøm listen
  });

  describe("SQL Strategy (Prisma)", () => {
    it("should create and retrieve a class", async () => {
      // Opret klasse
      const createdClass = await classService.create(sampleClass);
      createdClassIds.push(createdClass.ClassID); // Tilføj til oprydningslisten

      expect(createdClass).toHaveProperty("ClassID");

      // Hent klassen
      const fetchedClass = await classService.getById(createdClass.ClassID);

      // Sammenlign felter, der kræver speciel behandling
      expect(fetchedClass.ScheduleDate).toEqual(new Date(sampleClass.ScheduleDate));
      expect(fetchedClass.StartTime).toEqual(new Date(`1970-01-01T${sampleClass.StartTime}`));
      expect(fetchedClass.EndTime).toEqual(new Date(`1970-01-01T${sampleClass.EndTime}`));

      // Sammenlign de resterende felter
      expect(fetchedClass).toMatchObject({
        ClassName: sampleClass.ClassName,
        Description: sampleClass.Description,
        ClassType: sampleClass.ClassType,
        Duration: sampleClass.Duration,
        MaxParticipants: sampleClass.MaxParticipants,
        EmployeeID: sampleClass.EmployeeID,
        CenterID: sampleClass.CenterID,
      });
    });

    it("should update a class", async () => {
        const createdClass = await classService.create(sampleClass);
        createdClassIds.push(createdClass.ClassID);
      
        const updatedData = {
          ...sampleClass,
          ClassName: "Advanced Yoga",
          MaxParticipants: 25,
        };
      
        const updatedClass = await classService.update(createdClass.ClassID, updatedData);
      
        // Sammenlign parsed data
        expect(parseClassData(updatedClass)).toMatchObject(updatedData);
      
        const fetchedClass = await classService.getById(createdClass.ClassID);
      
        expect(parseClassData(fetchedClass)).toMatchObject(updatedData);
      });

    it("should delete a class", async () => {
      // Opret klasse
      const createdClass = await classService.create(sampleClass);
      createdClassIds.push(createdClass.ClassID); // Tilføj til oprydningslisten

      // Slet klasse
      const deleteResult = await classService.delete(createdClass.ClassID);

      expect(deleteResult).toHaveProperty("message", "Class deleted successfully");

      // Tjek at klassen ikke længere findes
      const fetchedClass = await classService.getById(createdClass.ClassID);

      expect(fetchedClass).toHaveProperty("error", "Class not found");

      // Fjern fra oprydningslisten, da den allerede er slettet
      createdClassIds.pop();
    });
  });
});
