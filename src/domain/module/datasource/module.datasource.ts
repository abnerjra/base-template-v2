import { ResponseEntity } from "../../shared/entity/response.entity";
import { CreateModuleDto } from "../dtos/create-module.dto";
import { GetModuleDto } from "../dtos/get-module.dto";
import { GetModulesDto } from "../dtos/get-modules.dto";
import { UpdateModuleDto } from "../dtos/update-module.dto";

export abstract class ModuleDatasource {

    abstract getModules(dto: GetModulesDto): Promise<ResponseEntity>

    abstract getModule(dto: GetModuleDto): Promise<ResponseEntity>

    abstract createModule(dto: CreateModuleDto): Promise<ResponseEntity>

    abstract updateModule(dto: UpdateModuleDto): Promise<ResponseEntity>
}