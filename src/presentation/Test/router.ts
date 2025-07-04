import { Router } from "express";
import { TestController } from "./controller";

export class TestRoutes {
    static get routes(): Router {
        const router = Router();

        const controller = new TestController();

        router.get("/welcome", controller.welcome.bind(controller));

        return router;
    }
}