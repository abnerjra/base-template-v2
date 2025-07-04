import { messages } from "../../../config";
import {
    CreateUserDto,
    GetUsersDto,
    ResponseEntity,
    UpdateUserDto,
    UserDatasource
} from "../../../domain";
import { CreateUserService } from "../services/create-user.service";
import { GetUserServices } from "../services/get-user.service";
import { GetUsersService } from "../services/get-users.service";
import { UpdateUserService } from "../services/update-user.service";

export class UserDatasourceImpl implements UserDatasource {
    private readonly getUsersService = new GetUsersService();
    private readonly getUserService = new GetUserServices();
    private readonly createUserService = new CreateUserService();
    private readonly updateUserService = new UpdateUserService();

    async getUsers(dto: GetUsersDto): Promise<ResponseEntity> {
        return this.getUsersService.execute(dto);
    }

    async getUser(id: number): Promise<ResponseEntity> {
        return this.getUserService.execute(id);
    }

    async createUser(dto: CreateUserDto): Promise<ResponseEntity> {
        return this.createUserService.execute(dto);
    }

    async updateUser(dto: UpdateUserDto): Promise<ResponseEntity> {
        return this.updateUserService.execute(dto);
    }
}