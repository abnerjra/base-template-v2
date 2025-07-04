import { messages } from "../../../config";
import { GetModuleDto, ResponseEntity } from "../../../domain";
import { ModuleEntity } from "../../../domain/module/entities/module.entity";
import { CatModuleModel } from "../../models/cat-module.model";

export class GetModuleService {
    private catModule = new CatModuleModel();
    async execute(dto: GetModuleDto): Promise<ResponseEntity> {
        try {
            const { id } = dto;

            const getModule = await this.catModule.findById(id)

            if (!getModule) return ResponseEntity.create(messages.response.empty);

            const permissions = await this.catModule.hasPermissions(getModule.id);
            const data = ModuleEntity.fromJson({...getModule, permissions});

            return ResponseEntity.create({ ...messages.response.reads, data });
        } catch (error) {
            console.log(error);

            if (error instanceof ResponseEntity) {
                return ResponseEntity.create(messages.error.notFound({ message: error.message }))
            }
            return ResponseEntity.create(messages.error.serverError);
        }
    }
}