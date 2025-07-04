import { ResponseEntity } from "../../shared/entity/response.entity";
import { GetRolesDto } from "../dtos/get-roles.dto";
import { RoleRepository } from "../repository/role.repository";

export interface IGetRolesUC {
    execute(dto: GetRolesDto): Promise<ResponseEntity>;
}

export class GetRolesUseCase implements IGetRolesUC {
    constructor(private readonly repository: RoleRepository) { }
    
    async execute(dto: GetRolesDto): Promise<ResponseEntity> {
        return this.repository.getRoles(dto);
    }
}