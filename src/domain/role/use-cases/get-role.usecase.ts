import { ResponseEntity } from "../../shared/entity/response.entity";
import { GetRoleDto } from "../dtos/get-role.dto";
import { RoleRepository } from "../repository/role.repository";

export interface IGetRoleUC {
    execute(dto: GetRoleDto): Promise<ResponseEntity>;
}

export class GetRoleUseCase implements IGetRoleUC {
    constructor(private readonly repository: RoleRepository) { }

    async execute(dto: GetRoleDto): Promise<ResponseEntity> {
        return this.repository.getRole(dto);
    }
}