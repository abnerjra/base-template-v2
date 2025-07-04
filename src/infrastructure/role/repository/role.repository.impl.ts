import {
    GetRoleDto,
    GetRolesDto,
    ResponseEntity,
    RoleDatasource,
    RoleRepository,
    UpdateRoleDto
} from "../../../domain";
import { CreateRoleDto } from "../../../domain/role/dtos/create-role.dto";

export class RoleRepositoryImpl implements RoleRepository {
    constructor(private readonly datasource: RoleDatasource) { }
    
    getRoles(dto: GetRolesDto): Promise<ResponseEntity> {
        return this.datasource.getRoles(dto);
    }

    getRole(dto: GetRoleDto): Promise<ResponseEntity> {
        return this.datasource.getRole(dto);
    }

    createRole(dto: CreateRoleDto): Promise<ResponseEntity> {
        return this.datasource.createRole(dto);
    }

    updateRole(dto: UpdateRoleDto): Promise<ResponseEntity> {
        return this.datasource.updateRole(dto);
    }
}