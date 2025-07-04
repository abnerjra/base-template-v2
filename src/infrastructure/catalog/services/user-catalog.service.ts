import { messages } from "../../../config";
import { ResponseEntity, UserEntity } from "../../../domain";
import { UserModel } from "../../models/user.model";

export class UserCatalogService {
    private userModel = new UserModel();

    async execute(): Promise<ResponseEntity> {
        const users = await this.userModel.findAll({ orderBy: { name: 'asc' } });
        const data = users.map(user => UserEntity.fromJson(user));
        return ResponseEntity.create({ ...messages.response.reads, data });
    }
}