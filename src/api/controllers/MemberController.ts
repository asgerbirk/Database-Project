import { Request, Response } from "express";
import {createMemberService} from "../services/MemberService.js";


const memberService = createMemberService("sql")

export async function getAll(req: Request, res: Response) {
    try {
        const members = await memberService.getAll();
        res.status(201).send(members);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

export async function getById(req: Request, res: Response) {
    try {
        const member = await memberService.getById(req.params);
        res.status(201).send({ member });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}
