import { Router } from "express";
import { RoleDatasourceImpl, RoleRepositoryImpl } from "../../infrastructure";
import { RoleController } from "./controller";

export class RoleRoutes {

    static get routes(): Router {
        const router = Router();

        const datasource = new RoleDatasourceImpl();
        const repository = new RoleRepositoryImpl(datasource);
        const controller = new RoleController(repository);

        router.get('/', controller.getRoles.bind(controller));
        router.get('/:id', controller.getRole.bind(controller));
        router.post('/', controller.createRole.bind(controller));
        router.put('/:id', controller.updateRole.bind(controller));

        return router;
    }
}