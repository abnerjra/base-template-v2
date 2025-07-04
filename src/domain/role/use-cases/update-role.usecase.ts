import { ResponseEntity } from "../../shared/entity/response.entity";
import { UpdateRoleDto } from "../dtos/update-role.dto";
import { RoleRepository } from "../repository/role.repository";

export interface IUpdateRolesUC {
    execute(dto: UpdateRoleDto): Promise<ResponseEntity>;
}

export class UpdateRoleUseCase implements IUpdateRolesUC {
    constructor(private readonly repository: RoleRepository) { }
    
    async execute(dto: UpdateRoleDto): Promise<ResponseEntity> {
        return this.repository.updateRole(dto);
    }
}