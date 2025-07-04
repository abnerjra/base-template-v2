import { ResponseEntity } from "../../shared/entity/response.entity";
import { UserRepository } from "../repository/user.repository";

export interface IGetUserUseCase {
    execute(id: number): Promise<ResponseEntity>
}

export class GetUserUseCase implements IGetUserUseCase {
    constructor(private readonly repository: UserRepository) { }

    async execute(id: number): Promise<ResponseEntity> {
        return this.repository.getUser(id);
    }
}