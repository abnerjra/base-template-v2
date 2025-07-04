import { Router } from "express";
import { UserController } from "./controller";
import { UserDatasourceImpl, UserRepositoryImpl } from "../../infrastructure";

export class UserRoutes {
    static get routes(): Router {
        const router = Router();

        const datasource = new UserDatasourceImpl();
        const repository = new UserRepositoryImpl(datasource);
        const controller = new UserController(repository);

        router.get('/', controller.getAll.bind(controller));
        router.get('/:id', controller.getById.bind(controller));
        router.post('/', controller.create.bind(controller));
        router.put('/:id', controller.update.bind(controller));

        return router;
    }
}