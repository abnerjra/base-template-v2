import { Router } from "express";
import { CatalogDatasourceImpl, CatalogRepositoryImpl } from "../../infrastructure";
import { CatalogController } from "./controller";

export class CatalogRoutes {
    static get routes():Router{
        const router = Router();
        
        const datasource = new CatalogDatasourceImpl();
        const repository = new CatalogRepositoryImpl(datasource);
        const controller = new CatalogController(repository);

        router.get('/module', controller.modules.bind(controller));
        router.get('/permission/list', controller.permissionsList.bind(controller));
        router.get('/role', controller.roles.bind(controller));
        router.get('/user', controller.users.bind(controller));

        return router;
    }
}