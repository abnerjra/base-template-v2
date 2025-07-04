import { messages } from "../../../config";
import { GetRoleDto, ResponseEntity, RoleEntity } from "../../../domain";
import { RoleModel } from "../../models/role.model";

export class GetRoleService {
    private roleModel = new RoleModel();

    async execute(dto: GetRoleDto): Promise<ResponseEntity> {
        try {
            const { id } = dto;
            console.log({ dto });

            const role = await this.roleModel.findById(id);
            if (!role) return ResponseEntity.create(messages.response.empty);

            const permissions = await this.roleModel.hasPermission(role.id);
            const data = RoleEntity.fromJson({ ...role, permissions });

            return ResponseEntity.create({ ...messages.response.reads, data });
        } catch (error) {
            console.log(error);

            if (error instanceof Error) {
                return ResponseEntity.create(messages.error.notFound({ message: error.message }));
            }
            return ResponseEntity.create(messages.error.serverError);
        }
    }
}