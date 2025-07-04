import { Router } from "express";
import { FileUploadController } from "./controller";
import { FileUploadMiddleware } from "../middleware";
import { FileUploadService } from "../../infrastructure";

export class FileUploadRoutes {
    static get routes(): Router {
        const router = Router();

        const localUploadService = new FileUploadService();
        const controller = new FileUploadController(localUploadService);

        const middlewares = [
            FileUploadMiddleware.execute
        ]

        router.post('/temp/:type', middlewares, controller.uploadSingle.bind(controller));

        return router;
    }
}