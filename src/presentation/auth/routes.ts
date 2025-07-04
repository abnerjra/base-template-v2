import { Router } from "express";
import { AuthDatasourceImpl, AuthRepositoryImpl } from "../../infrastructure";
import { AuthConroller } from "./controller";

export class AuthRoutes {
    static get routes(): Router {
        const router = Router();

        const datasouurce = new AuthDatasourceImpl();
        const repository = new AuthRepositoryImpl(datasouurce);
        const controller = new AuthConroller(repository);

        router.post("/login", controller.login.bind(controller));

        return router;
    }

    static get protectedRoutes(): Router {
        const router = Router();

        const datasouurce = new AuthDatasourceImpl();
        const repository = new AuthRepositoryImpl(datasouurce);
        const controller = new AuthConroller(repository);

        router.post("/logout", controller.logout.bind(controller));

        return router;
    }
}