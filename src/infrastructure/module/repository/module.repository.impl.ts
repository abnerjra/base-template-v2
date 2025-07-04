import { CreateModuleDto, GetModulesDto, ModuleDatasource, ModuleRepository, ResponseEntity, UpdateModuleDto } from "../../../domain";
import { GetModuleDto } from "../../../domain/module/dtos/get-module.dto";

export class ModuleRepositoryImpl implements ModuleRepository {
    constructor(private readonly datasource: ModuleDatasource) { }

    getModules(dto: GetModulesDto): Promise<ResponseEntity> {
        return this.datasource.getModules(dto);
    }

    getModule(dto: GetModuleDto): Promise<ResponseEntity> {
        return this.datasource.getModule(dto);
    }

    createModule(dto: CreateModuleDto): Promise<ResponseEntity> {
        return this.datasource.createModule(dto);
    }

    updateModule(dto: UpdateModuleDto): Promise<ResponseEntity> {
        return this.datasource.updateModule(dto);
    }
}