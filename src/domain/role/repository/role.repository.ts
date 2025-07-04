import { ResponseEntity } from "../../shared/entity/response.entity";
import { CreateRoleDto } from "../dtos/create-role.dto";
import { GetRoleDto } from "../dtos/get-role.dto";
import { GetRolesDto } from "../dtos/get-roles.dto";
import { UpdateRoleDto } from "../dtos/update-role.dto";

export abstract class RoleRepository {
    abstract getRoles(dto: GetRolesDto): Promise<ResponseEntity>

    abstract getRole(dto: GetRoleDto): Promise<ResponseEntity>

    abstract createRole(dto: CreateRoleDto): Promise<ResponseEntity>

    abstract updateRole(dto: UpdateRoleDto): Promise<ResponseEntity>
}