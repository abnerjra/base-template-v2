import { CatalogDatasource, CatalogRepository, ResponseEntity } from "../../../domain";

export class CatalogRepositoryImpl implements CatalogRepository {
    constructor(private readonly datasource: CatalogDatasource) { }

    module(): Promise<ResponseEntity> {
        return this.datasource.module();
    }
    
    permissionList(): Promise<ResponseEntity> {
        return this.datasource.permissionList();
    }
    
    role(): Promise<ResponseEntity> {
        return this.datasource.role();
    }
    
    user(): Promise<ResponseEntity> {
        return this.datasource.user();
    }
}