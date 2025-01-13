import { Request, Response } from "express";
import { createClassService } from "../services/ClassService.js";

const classService = createClassService();

// Get all classes
export async function getAll(req: Request, res: Response) {
    try {
        const classes = await classService.getAll();
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve classes" });
    }
}

// Get a class by ID
export async function getById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const classData = await classService.getById(Number(id));
        res.status(200).json(classData);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve the class" });
    }
}

// Create a new class
export async function Add(req: Request, res: Response) {
    try {
        const newClass = await classService.create(req.body);
        res.status(201).send({newClass});
    } catch (error) {
        res.status(500).send({ error: error.message || "Failed to create the class" });
    }
}

// Update a class
export async function Update(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const updatedClass = await classService.update(Number(id), req.body);
        res.status(201).json(updatedClass);
    } catch (error) {
        res.status(500).json({ error: "Failed to update the class" });
    }
}

// Delete a class
export async function Delete(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await classService.delete(Number(id));
        res.status(200).json({ message: "Class deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete the class" });
    }
}
