import { ResponseEntity } from "../../shared/entity/response.entity";
import { GetModulesDto } from "../dtos/get-modules.dto";
import { ModuleRepository } from "../repository/module.repository";

export interface IGetModulesUC {
    execute(dto: GetModulesDto): Promise<ResponseEntity>
}

export class GetModulesUseCase implements IGetModulesUC {
    constructor(private readonly repository: ModuleRepository) { }

    async execute(dto: GetModulesDto): Promise<ResponseEntity> {
        return this.repository.getModules(dto);
    }
}