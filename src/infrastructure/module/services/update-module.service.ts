import { messages } from "../../../config";
import { UpdateModuleDto, ResponseEntity } from "../../../domain";
import { ModuleEntity } from "../../../domain/module/entities/module.entity";
import { CatModuleModel } from "../../models/cat-module.model";
import { PermissionValidator } from "../../shared/validators/permission.validator";

export class UpdateModuleService {
    private modelCatModule = new CatModuleModel();

    async execute(dto: UpdateModuleDto): Promise<ResponseEntity> {
        try {
            const existsModule = await this.modelCatModule.findOne({ where: { name: dto.name, NOT: { id: dto.id } } });
            if (existsModule) return ResponseEntity.create(messages.validate.personalized({ message: 'Ya existe un módulo con ese nombre' }));

            const existsKeyModule = await this.modelCatModule.findOne({ where: { key: dto.key, NOT: { id: dto.id } } });
            if (existsKeyModule) return ResponseEntity.create(messages.validate.personalized({ message: 'Ya existe un módulo con esa clave' }));

            // permissions validate
            const validator = new PermissionValidator();
            const validateResult = await validator.existsPermit(dto.permissions);
            if (!validateResult.isValid) {
                return ResponseEntity.create({
                    ...messages.validate.personalized({
                        severity: validateResult.content!.severity,
                        message: validateResult.content!.message,
                        statusCode: validateResult.content!.statusCode,
                        data: validateResult.content!.data
                    })
                });
            }

            // updated record
            const { id, permissions, ...data } = dto;
            const result = await this.modelCatModule.update({ data: data, where: { id: id } });
            if (result) this.modelCatModule.handlePermissionsAssignment(result.id, permissions);
            const associatedPermits = await this.modelCatModule.hasPermissions(result.id);
            const module = ModuleEntity.fromJson({ ...result, permissions: associatedPermits });
            return ResponseEntity.create({ ...messages.response.update, data: module });
        } catch (error) {
            console.log(error);
            if (error instanceof ResponseEntity) {
                return ResponseEntity.create(messages.error.notFound({ message: error.message }))
            }
            return ResponseEntity.create(messages.error.serverError)
        }
    }
}