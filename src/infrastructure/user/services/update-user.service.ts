import { BcryptPlugin, messages } from "../../../config";
import { UpdateUserDto, ResponseEntity, UserEntity } from "../../../domain";
import { UserModel } from "../../models/user.model";

export class UpdateUserService {
    private userModel = new UserModel();

    async execute(dto: UpdateUserDto) {
        try {
            const { email } = dto;

            const exist = await this.userModel.findById(dto.id);
            if (!exist) return ResponseEntity.create(messages.validate.notExists);

            const existEmail = await this.userModel.findOne({ where: { email: email, NOT: { id: dto.id } } })
            if (existEmail) return ResponseEntity.create(messages.validate.existsEmail)

            const { id, role, ...dataUser } = dto;
            let data = dataUser;

            if (dto.password) {
                let password: string = BcryptPlugin.hash(dto.password);;
                data = { ...dataUser, password }
            }

            const result = await this.userModel.update({ data, where: { id: id } });
            if (result) await this.userModel.handleRoleAssignment(result.id, role);
            const roles = await this.userModel.hasRole(result.id);
            const user = UserEntity.fromJson({ ...result, roles });

            return ResponseEntity.create({ ...messages.response.update, data: user });
        } catch (error) {
            console.log(error);

            if (error instanceof Error) {
                return ResponseEntity.create(messages.error.notFound({ message: error.message }));
            }
            return ResponseEntity.create(messages.error.serverError);
        }
    }
}