import { Router } from "express";
import {
    ModuleDatasourceImpl,
    ModuleRepositoryImpl
} from "../../infrastructure";
import { ModuleController } from "./controller";

export class ModuleRoutes {
    static get routes(): Router {
        const router = Router();

        const datasource = new ModuleDatasourceImpl();
        const repository = new ModuleRepositoryImpl(datasource);
        const controller = new ModuleController(repository);

        router.get('/', controller.getModules.bind(controller));
        router.get('/:id', controller.getModule.bind(controller));
        router.post('/', controller.createModule.bind(controller));
        router.put('/:id', controller.updateModule.bind(controller));

        return router;
    }
}