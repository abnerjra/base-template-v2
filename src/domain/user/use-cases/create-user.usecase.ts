import { ResponseEntity } from "../../shared/entity/response.entity";
import { CreateUserDto } from "../dtos/create-user.dto";
import { UserRepository } from "../repository/user.repository";

export interface ICreateUserUC {
    execute(dto: CreateUserDto): Promise<ResponseEntity>
}

export class CreateUserUseCase implements ICreateUserUC {
    constructor(private readonly repository: UserRepository) { }

    async execute(dto: CreateUserDto): Promise<ResponseEntity> {
        return this.repository.createUser(dto);
    }
}