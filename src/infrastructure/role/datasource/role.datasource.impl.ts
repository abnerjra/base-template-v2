import {
    CreateRoleDto,
    GetRoleDto,
    GetRolesDto,
    ResponseEntity,
    RoleDatasource,
    UpdateRoleDto
} from "../../../domain";
import { CreateRoleService } from "../services/create-role.service";
import { GetRoleService } from "../services/get-role.service";
import { GetRolesService } from "../services/get-roles.service";
import { UpdateRoleService } from "../services/update-role.service";

export class RoleDatasourceImpl implements RoleDatasource {
    private getRolesService = new GetRolesService();
    private getRoleService = new GetRoleService();
    private createRoleService = new CreateRoleService();
    private updateRoleService = new UpdateRoleService();

    async getRoles(dto: GetRolesDto): Promise<ResponseEntity> {
        return this.getRolesService.execute(dto);
    }

    async getRole(dto: GetRoleDto): Promise<ResponseEntity> {
        return this.getRoleService.execute(dto);
    }

    async createRole(dto: CreateRoleDto): Promise<ResponseEntity> {
        return this.createRoleService.execute(dto);
    }

    async updateRole(dto: UpdateRoleDto): Promise<ResponseEntity> {
        return this.updateRoleService.execute(dto);
    }
}