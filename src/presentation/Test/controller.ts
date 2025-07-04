import { Request, Response } from "express";
import { getDate } from "../../config";

export class TestController {
    public welcome = (req: Request, res: Response) => {
        const { iso } = getDate();
        
        res.status(200).json({ message: "Welcome to the API!", data: { date: iso } });
        return;
    }
}