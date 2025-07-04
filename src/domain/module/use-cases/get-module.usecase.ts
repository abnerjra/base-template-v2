import { ResponseEntity } from "../../shared/entity/response.entity";
import { GetModuleDto } from "../dtos/get-module.dto";
import { ModuleRepository } from "../repository/module.repository";

export interface IGetModuleUC {
    execute(dto: GetModuleDto): Promise<ResponseEntity>
}

export class GetModuleUseCase implements IGetModuleUC {
    constructor(private readonly repository: ModuleRepository) { }

    async execute(dto: GetModuleDto): Promise<ResponseEntity> {
        return this.repository.getModule(dto);
    }
}