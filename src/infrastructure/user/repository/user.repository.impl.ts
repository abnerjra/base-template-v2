import {
    CreateUserDto,
    GetUsersDto,
    ResponseEntity,
    UpdateUserDto,
    UserDatasource,
    UserRepository
} from "../../../domain";

export class UserRepositoryImpl implements UserRepository {
    constructor(private readonly datasource: UserDatasource) { }

    getUsers(dto: GetUsersDto): Promise<ResponseEntity> {
        return this.datasource.getUsers(dto);
    }

    getUser(id: number): Promise<ResponseEntity> {
        return this.datasource.getUser(id);
    }

    createUser(dto: CreateUserDto): Promise<ResponseEntity> {
        return this.datasource.createUser(dto);
    }

    updateUser(dto: UpdateUserDto): Promise<ResponseEntity> {
        return this.datasource.updateUser(dto);
    }
}