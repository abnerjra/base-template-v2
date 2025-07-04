import { ResponseEntity } from "../../shared/entity/response.entity";
import { GetUsersDto } from "../dtos/get-users.dto";
import { UserRepository } from "../repository/user.repository";

export interface IUserUseCase {
    execute(dto: GetUsersDto): Promise<ResponseEntity>
}

export class GetUsersUseCase implements IUserUseCase {
    constructor(private readonly repository: UserRepository) { }

    async execute(dto: GetUsersDto): Promise<ResponseEntity> {
        return this.repository.getUsers(dto);
    }
}