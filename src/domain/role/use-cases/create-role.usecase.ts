import { ResponseEntity } from "../../shared/entity/response.entity";
import { CreateRoleDto } from "../dtos/create-role.dto";
import { RoleRepository } from "../repository/role.repository";

export interface ICreateRolesUC {
    execute(dto: CreateRoleDto): Promise<ResponseEntity>;
}

export class CreateRoleUseCase implements ICreateRolesUC {
    constructor(private readonly repository: RoleRepository) { }
    
    async execute(dto: CreateRoleDto): Promise<ResponseEntity> {
        return this.repository.createRole(dto);
    }
}