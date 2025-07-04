import { ResponseEntity } from "../../shared/entity/response.entity";
import { CatalogRepository } from "../repository/catalog.repository";

export interface IUserCatalogUC {
    execute(): Promise<ResponseEntity>
}

export class UserCatalogUseCase implements IUserCatalogUC {
    constructor(private readonly respository: CatalogRepository) { }
    
    async execute(): Promise<ResponseEntity> {
        return this.respository.user();
    }
}