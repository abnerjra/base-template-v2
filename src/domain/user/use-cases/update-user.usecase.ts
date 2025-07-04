import { ResponseEntity } from "../../shared/entity/response.entity";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { UserRepository } from "../repository/user.repository";

export interface IUpdateUserUC {
    execute(dto: UpdateUserDto): Promise<ResponseEntity>
}

export class UpdateUserUseCase implements IUpdateUserUC {
    constructor(private readonly repository: UserRepository) { }

    async execute(dto: UpdateUserDto): Promise<ResponseEntity> {
        return this.repository.updateUser(dto);
    }
}