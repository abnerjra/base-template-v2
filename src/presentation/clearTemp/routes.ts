import { Router } from "express";
import { ClearTempService } from "../../infrastructure";
import { ClearTempController } from "./controller";

export class ClearTempRoutes {
    static get routes():Router{
        const router = Router();

        const clearService = new ClearTempService();
        const controller = new ClearTempController(clearService);
        
        router.delete('/temp/:type', controller.clearTemp.bind(controller));
        router.delete('/all/temp', controller.clearAllTemp.bind(controller));

        return router;
    }
}