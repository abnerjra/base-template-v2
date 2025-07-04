import { messages } from "../../../config";
import { ResponseEntity, RoleEntity } from "../../../domain";
import { RoleModel } from "../../models/role.model";

export class RoleCatalogService {
    private roleModel = new RoleModel();

    async execute(): Promise<ResponseEntity> {
        const roles = await this.roleModel.findAll({ orderBy: { name: 'asc' } });
        const data = roles.map(role => RoleEntity.fromJson(role));
        return ResponseEntity.create({ ...messages.response.reads, data });
    }
}