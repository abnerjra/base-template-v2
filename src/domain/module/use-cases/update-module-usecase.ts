import { ResponseEntity } from "../../shared/entity/response.entity";
import { UpdateModuleDto } from "../dtos/update-module.dto";
import { ModuleRepository } from "../repository/module.repository";

export interface IUpdateModuleUC {
    execute(dto: UpdateModuleDto): Promise<ResponseEntity>;
}

export class UpdateModuleUseCase implements IUpdateModuleUC {
    constructor(private readonly repository: ModuleRepository) { }

    async execute(dto: UpdateModuleDto): Promise<ResponseEntity> {
        return this.repository.updateModule(dto);
    }
}