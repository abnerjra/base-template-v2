import { messages } from "../../../config";
import { CreateRoleDto, ResponseEntity } from "../../../domain";
import { RoleModel } from "../../models/role.model";
import { ValidateModulePermission } from "../../shared/validators/module-permission.validator";

export class CreateRoleService {
    private roleModel = new RoleModel();

    async execute(dto: CreateRoleDto): Promise<ResponseEntity> {
        try {
            const { key, name } = dto;
            const existRoleName = await this.roleModel.findOne({ where: { name } });
            if (existRoleName) return ResponseEntity.create(messages.validate.personalized({ message: `Ya existe un rol con el nombre ${name}` }))
            const existRoleKey = await this.roleModel.findOne({ where: { key } });
            if (existRoleKey) return ResponseEntity.create(messages.validate.personalized({ message: `Ya existe un rol con la clave ${key}` }))

            const { modules, ...role } = dto;

            const validator = new ValidateModulePermission();
            const validateResult = await validator.handleValidate(modules);
            if (!validateResult.isValid) {
                return ResponseEntity.create({
                    ...messages.validate.personalized({
                        severity: validateResult.message!.severity,
                        message: validateResult.message!.message,
                        statusCode: validateResult.message!.statusCode,
                        data: validateResult.message!.data
                    })
                });
            }

            const result = await this.roleModel.create(role);
            if (result) await this.roleModel.handlePermissionsAssignment(result.id, modules);

            return ResponseEntity.create({ ...messages.response.create, data: result.id });
        } catch (error) {
            console.log(error);

            if (error instanceof Error) {
                return ResponseEntity.create(messages.error.notFound({ message: error.message }));
            }
            return ResponseEntity.create(messages.error.serverError);
        }
    }
}