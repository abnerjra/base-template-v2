import { CatalogDatasource, ResponseEntity } from "../../../domain";
import { ModuleCatalogService } from "../services/module-catalog.service";
import { PermissionListCatalogService } from "../services/permission-list-catalog.service";
import { RoleCatalogService } from "../services/role-catalog.service";
import { UserCatalogService } from "../services/user-catalog.service";

export class CatalogDatasourceImpl implements CatalogDatasource {
    private moduleService = new ModuleCatalogService();
    private permissionListService = new PermissionListCatalogService();
    private roleService = new RoleCatalogService();
    private userService = new UserCatalogService();

    async module(): Promise<ResponseEntity> {
        return this.moduleService.execute();
    }

    async permissionList(): Promise<ResponseEntity> {
        return this.permissionListService.execute();
    }

    async role(): Promise<ResponseEntity> {
        return this.roleService.execute();
    }

    async user(): Promise<ResponseEntity> {
        return this.userService.execute();
    }

}