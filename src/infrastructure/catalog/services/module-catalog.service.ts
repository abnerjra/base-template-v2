import { messages } from "../../../config";
import { ResponseEntity } from "../../../domain";
import { ModuleEntity } from "../../../domain/module/entities/module.entity";
import { CatModuleModel } from "../../models/cat-module.model";

export class ModuleCatalogService {
    private catMouleModel = new CatModuleModel();

    async execute(): Promise<ResponseEntity> {
        const modules = await this.catMouleModel.findAll({ orderBy: { name: 'asc' } });
        const data = modules.map(module => ModuleEntity.fromJson(module));
        return ResponseEntity.create({ ...messages.response.reads, data });
    }
}