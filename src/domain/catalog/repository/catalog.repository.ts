import { ResponseEntity } from "../../shared/entity/response.entity";

export abstract class CatalogRepository {
    abstract module(): Promise<ResponseEntity>
    abstract permissionList(): Promise<ResponseEntity>
    abstract role(): Promise<ResponseEntity>
    abstract user(): Promise<ResponseEntity>
}