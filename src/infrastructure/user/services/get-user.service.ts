import { messages } from "../../../config";
import { GetUsersDto, ResponseEntity, UserEntity } from "../../../domain";
import { UserModel } from "../../models/user.model";

export class GetUserServices {
    private userModel = new UserModel();

    async execute(id: number): Promise<ResponseEntity> {
        try {
            const user = await this.userModel.findById(id);
            if (!user) return ResponseEntity.create(messages.response.empty);

            const role = await this.userModel.hasRole(user.id);

            const data = UserEntity.fromJson({ ...user, roles: role })

            return ResponseEntity.create({ ...messages.response.reads, data });
        } catch (error) {
            console.log(error);

            if (error instanceof Error) {
                return ResponseEntity.create(messages.error.notFound({ message: error.message }));
            }
            return ResponseEntity.create(messages.error.serverError);
        }
    }
}