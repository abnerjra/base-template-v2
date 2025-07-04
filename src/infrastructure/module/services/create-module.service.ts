import { constants } from "buffer";
import { messages } from "../../../config";
import { CreateModuleDto, ResponseEntity } from "../../../domain";
import { CatModuleModel } from "../../models/cat-module.model";
import { PermissionValidator } from "../../shared/validators/permission.validator";
import { prisma } from "../../../data/postgres/prisma";
import { ModuleEntity } from "../../../domain/module/entities/module.entity";

export class CreateModuleService {
    private modelCatModule = new CatModuleModel();

    async execute(dto: CreateModuleDto): Promise<ResponseEntity> {
        try {
            const existsModule = await this.modelCatModule.findOne({ where: { name: { contains: dto.name, mode: 'insensitive' } } });
            if (existsModule) return ResponseEntity.create(messages.validate.personalized({ message: 'Ya existe un modulo con ese nombre' }));

            const existsKeyModule = await this.modelCatModule.findOne({ where: { key: dto.key } });
            if (existsKeyModule) return ResponseEntity.create(messages.validate.personalized({ message: 'Ya existe un modulo con esa clave' }));

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

            // create record
            const { permissions, ...data } = dto;
            const result = await this.modelCatModule.create(data);
            if (result) this.modelCatModule.handlePermissionsAssignment(result.id, permissions);
            const associatedPermits = await this.modelCatModule.hasPermissions(result.id);
            const module = ModuleEntity.fromJson({ ...result, permissions: associatedPermits });
            return ResponseEntity.create({ ...messages.response.create, data: module });
        } catch (error) {
            console.log(error);
            if (error instanceof ResponseEntity) {
                return ResponseEntity.create(messages.error.notFound({ message: error.message }))
            }
            return ResponseEntity.create(messages.error.serverError)
        }
    }
}