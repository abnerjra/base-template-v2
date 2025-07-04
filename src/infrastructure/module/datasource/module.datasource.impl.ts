import { CreateModuleDto, GetModulesDto, ModuleDatasource, ResponseEntity, UpdateModuleDto } from "../../../domain";
import { GetModuleDto } from "../../../domain/module/dtos/get-module.dto";
import { CreateModuleService } from "../services/create-module.service";
import { GetModuleService } from "../services/get-module.service";
import { GetModulesService } from "../services/get-modules.service";
import { UpdateModuleService } from "../services/update-module.service";

export class ModuleDatasourceImpl implements ModuleDatasource {
    private getModulesService = new GetModulesService();
    private getModuleService = new GetModuleService();
    private createModuleService = new CreateModuleService();
    private updateModuleService = new UpdateModuleService();

    async getModules(dto: GetModulesDto): Promise<ResponseEntity> {
        return this.getModulesService.execute(dto);
    }

    async getModule(dto: GetModuleDto): Promise<ResponseEntity> {
        return this.getModuleService.execute(dto);
    }

    async createModule(dto: CreateModuleDto): Promise<ResponseEntity> {
        return this.createModuleService.execute(dto);
    }

    async updateModule(dto: UpdateModuleDto): Promise<ResponseEntity> {
        return this.updateModuleService.execute(dto);
    }

}