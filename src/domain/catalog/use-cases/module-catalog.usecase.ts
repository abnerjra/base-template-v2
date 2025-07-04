import { ResponseEntity } from "../../shared/entity/response.entity";
import { CatalogRepository } from "../repository/catalog.repository";

export interface IModuleCatalogUC {
    execute(): Promise<ResponseEntity>
}

export class ModuleCatalogUseCase implements IModuleCatalogUC {
    constructor(private readonly respository: CatalogRepository) { }
    
    async execute(): Promise<ResponseEntity> {
        return this.respository.module();
    }
}