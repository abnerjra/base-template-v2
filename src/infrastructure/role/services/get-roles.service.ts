import { messages } from "../../../config";
import { GetRolesDto, ResponseEntity, RoleEntity } from "../../../domain";
import { RoleModel } from "../../models/role.model";

export class GetRolesService {
    private roleModel = new RoleModel();

    async execute(dto: GetRolesDto): Promise<ResponseEntity> {
        try {
            const { limit, page, active, description, name } = dto;

            let filters: { [key: string]: any } = {};
            filters.skip = (page - 1) * limit;
            filters.take = limit;
            if (name) filters.where = { name: { contains: name, mode: 'insensitive' } }
            if (description) filters.where = { description: { contains: description, mode: 'insensitive' } }
            if (active) filters.where = { active }

            const getRoles = await this.roleModel.findAll(filters);
            if (getRoles.length === 0) return ResponseEntity.create(messages.response.empty);

            const data = await Promise.all(
                getRoles.map(async (role) => {
                    const permissions = await this.roleModel.hasPermission(role.id);
                    return RoleEntity.fromJson({ ...role, permissions });
                })
            )

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