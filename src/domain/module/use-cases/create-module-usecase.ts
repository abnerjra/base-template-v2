import { ResponseEntity } from "../../shared/entity/response.entity";
import { CreateModuleDto } from "../dtos/create-module.dto";
import { ModuleRepository } from "../repository/module.repository";

export interface ICreateModuleUC {
    execute(dto: CreateModuleDto): Promise<ResponseEntity>;
}

export class CreateModuleUseCase implements ICreateModuleUC {
    constructor(private readonly repository: ModuleRepository) { }
    
    async execute(dto: CreateModuleDto): Promise<ResponseEntity> {
        return this.repository.createModule(dto);
    }
}