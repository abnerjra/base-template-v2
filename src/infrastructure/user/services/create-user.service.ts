import { BcryptPlugin, messages } from "../../../config";
import { CreateUserDto, ResponseEntity, UserEntity } from "../../../domain";
import { UserModel } from "../../models/user.model";

export class CreateUserService {
    private userModel = new UserModel();

    async execute(dto: CreateUserDto) {
        try {
            const { email } = dto;
            const existsEmail = await this.userModel.findOne({ where: { email: { contains: email, mode: 'insensitive' } } })
            if (existsEmail) return ResponseEntity.create(messages.validate.existsEmail);

            const { role, ...dataUser } = dto;

            let password: string = BcryptPlugin.hash(dto.password);
            const result = await this.userModel.create({ ...dataUser, password });
            if (result) await this.userModel.handleRoleAssignment(result.id, role);
            const roles = await this.userModel.hasRole(result.id);
            const user = UserEntity.fromJson({ ...result, roles });

            return ResponseEntity.create({ ...messages.response.create, data: user });
        } catch (error) {
            console.log(error);

            if (error instanceof Error) {
                return ResponseEntity.create(messages.error.notFound({ message: error.message }));
            }
            return ResponseEntity.create(messages.error.serverError);
        }
    }
}