import { ResponseEntity } from "../../shared/entity/response.entity";
import { LogoutDto } from "../dtos/logout.dto";
import { AuthRepository } from "../repository/auth.repository";

export interface IUseCase {
    execute(dto: LogoutDto): Promise<ResponseEntity>
}

export class LogoutUseCase implements IUseCase {
    constructor(private readonly repository: AuthRepository) { }

    execute = async (dto: LogoutDto): Promise<ResponseEntity> => this.repository.logout(dto)
}