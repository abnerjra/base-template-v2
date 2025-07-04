import { messages } from "../../../config";
import { PermissionEntity, ResponseEntity } from "../../../domain";
import { CatPermissionModel } from "../../models/cat-permission.model";

export class PermissionListCatalogService {
    private permissionListModel = new CatPermissionModel();

    async execute(): Promise<ResponseEntity> {
        const permissionList = await this.permissionListModel.findAll({ orderBy: { key: 'asc' } });
        const data = permissionList.map(per => PermissionEntity.fromJson(per));
        return ResponseEntity.create({ ...messages.response.reads, data });
    }
}