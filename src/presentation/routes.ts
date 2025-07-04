import { Router } from "express";
import { TestRoutes } from "./Test/router";
import { AuthRoutes } from "./auth/routes";
import { UserRoutes } from "./user/routes";
import { AuthMiddleware } from "./middleware";
import { FileUploadRoutes } from "./file-upload/router";
import { ClearTempRoutes } from "./clearTemp/routes";
import { RoleRoutes } from "./role/routes";
import { ModuleRoutes } from "./module/routes";
import { CatalogRoutes } from "./catalog/routes";

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        const prefxix = "/api";
        const version = "v1";

        //* Public Routes
        router.use(`${prefxix}/${version}/test`, TestRoutes.routes);
        router.use(`${prefxix}/${version}/auth`, AuthRoutes.routes);

        //* Middleware auth
        const middlewares = [
            AuthMiddleware.execute
        ]
        router.use(middlewares)

        router.use(`${prefxix}/${version}/auth`, AuthRoutes.protectedRoutes);
        router.use(`${prefxix}/${version}/user`, UserRoutes.routes);
        router.use(`${prefxix}/${version}/role`, RoleRoutes.routes);
        router.use(`${prefxix}/${version}/module`, ModuleRoutes.routes);

        // * catalogs
        router.use(`${prefxix}/${version}/catalog`, CatalogRoutes.routes);

        // * Files temp
        router.use(`${prefxix}/${version}/file/upload`, FileUploadRoutes.routes);
        router.use(`${prefxix}/${version}/clear`, ClearTempRoutes.routes);


        return router;
    }
}