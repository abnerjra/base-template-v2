import { ResponseEntity } from "../../shared/entity/response.entity";
import { CatalogRepository } from "../repository/catalog.repository";

export interface IPermissionListCatalogUC {
    execute(): Promise<ResponseEntity>
}

export class PermissionListCatalogUseCase implements IPermissionListCatalogUC {
    constructor(private readonly respository: CatalogRepository) { }
    
    async execute(): Promise<ResponseEntity> {
        return this.respository.permissionList();
    }
}