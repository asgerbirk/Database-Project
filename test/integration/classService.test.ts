import { describe, it, expect, afterEach } from "vitest";
import { createClassService } from "../../src/api/services/ClassService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Class Service - Integration Tests", () => {
  const classService = createClassService();

  const sampleClass = {
    ClassName: "Yoga",
    Description: "A relaxing yoga session",
    ClassType: "Fitness",
    Duration: 60,
    MaxParticipants: 20,
    EmployeeID: 1,
    CenterID: 1,
    ScheduleDate: "2025-01-15",
    StartTime: "08:00", 
    EndTime: "09:00",   
  };

  const createdClassIds: number[] = [];

  const parseClassData = (classData: any) => {
    const toDate = (value: any) => (value instanceof Date ? value : new Date(value));
    const formatTime = (time: string | Date) => {
      const date = toDate(time);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };
  
    return {
      ...classData,
      ScheduleDate: toDate(classData.ScheduleDate).toISOString().split("T")[0], 
      StartTime: formatTime(classData.StartTime),                               
      EndTime: formatTime(classData.EndTime),                                   
    };
  };

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
    createdClassIds.length = 0;
  });

  describe("SQL Strategy (Prisma)", () => {
    it("should create and retrieve a class", async () => {
      const createdClass = await classService.create(sampleClass);
      createdClassIds.push(createdClass.ClassID); 

      expect(createdClass).toHaveProperty("ClassID");

      const fetchedClass = await classService.getById(createdClass.ClassID);

      expect(fetchedClass.ScheduleDate).toEqual(new Date(sampleClass.ScheduleDate));
      expect(fetchedClass.StartTime).toEqual(new Date(`1970-01-01T${sampleClass.StartTime}`));
      expect(fetchedClass.EndTime).toEqual(new Date(`1970-01-01T${sampleClass.EndTime}`));

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
      
        expect(parseClassData(updatedClass)).toMatchObject(updatedData);
      
        const fetchedClass = await classService.getById(createdClass.ClassID);
      
        expect(parseClassData(fetchedClass)).toMatchObject(updatedData);
      });

    it("should delete a class", async () => {
      const createdClass = await classService.create(sampleClass);
      createdClassIds.push(createdClass.ClassID); 

      const deleteResult = await classService.delete(createdClass.ClassID);

      expect(deleteResult).toHaveProperty("message", "Class deleted successfully");

      const fetchedClass = await classService.getById(createdClass.ClassID);

      expect(fetchedClass).toHaveProperty("error", "Class not found");

      createdClassIds.pop();
    });
  });
});
