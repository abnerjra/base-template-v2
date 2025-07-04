import { messages, regularExpression } from "../../../config";
import { ResponseEntity } from "../../shared/entity/response.entity";

export class LogoutDto {
    private constructor(
        public readonly token: string
    ) { }

    static create(token: string): ResponseEntity | LogoutDto {
        let validateMessage: string[] = [];

        if (!token) validateMessage.push('Es necesario proporcionar el token de acceso');

        if (!token.startsWith('Bearer ')) validateMessage.push('El token de acceso debe ser de tipo Bearer');

        if (validateMessage.length > 0) {
            return ResponseEntity.create(messages.validate.fields({ messages: validateMessage }));
        }

        const auxToken = token.split(' ')[1] || '';
        token = auxToken;

        return new LogoutDto(token);
    }
}