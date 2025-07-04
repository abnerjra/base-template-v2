import { ResponseEntity } from "../../shared/entity/response.entity";
import { CatalogRepository } from "../repository/catalog.repository";

export interface IRoleCatalogUC {
    execute(): Promise<ResponseEntity>
}

export class RoleCatalogUseCase implements IRoleCatalogUC {
    constructor(private readonly respository: CatalogRepository) { }
    
    async execute(): Promise<ResponseEntity> {
        return this.respository.role();
    }
}