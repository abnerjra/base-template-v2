import { ResponseEntity } from "../../shared/entity/response.entity";
import { CreateUserDto } from "../dtos/create-user.dto";
import { GetUsersDto } from "../dtos/get-users.dto";
import { UpdateUserDto } from "../dtos/update-user.dto";

export abstract class UserDatasource {
    abstract getUsers(dto: GetUsersDto): Promise<ResponseEntity>

    abstract getUser(id: number): Promise<ResponseEntity>

    abstract createUser(dto: CreateUserDto): Promise<ResponseEntity>

    abstract updateUser(dto: UpdateUserDto): Promise<ResponseEntity>
}