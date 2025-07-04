import { messages } from "../../../config";
import { LogoutDto, ResponseEntity } from "../../../domain";
import { AuthTokenModel } from "../../models/authToken.model";

export class LogoutService {
    private authModel = new AuthTokenModel();

    async logout(dto: LogoutDto): Promise<ResponseEntity> {
        try {
            const token = dto.token;
            await this.authModel.update({ where: { token }, data: { revoked: true } })
            return ResponseEntity.create(messages.auth.logout)
        } catch (error) {
            console.log(error);

            if (error instanceof Error) {
                return ResponseEntity.create(messages.error.notFound({ message: error.message }));
            }
            return ResponseEntity.create(messages.error.serverError);
        }
    }
}