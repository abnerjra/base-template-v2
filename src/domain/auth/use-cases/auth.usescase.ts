import { ResponseEntity } from "../../shared/entity/response.entity";
import { AuthDto } from "../dtos/auth.dto";
import { AuthRepository } from "../repository/auth.repository";

export interface IAuthUseCase {
    execute(dto: AuthDto): Promise<ResponseEntity>
}

export class AuthUseCase implements IAuthUseCase {
    constructor(private readonly repository: AuthRepository) { }

    execute = async (dto: AuthDto): Promise<ResponseEntity> => this.repository.login(dto)
}