import { messages, regularExpression } from "../../../config";
import { ResponseEntity } from "../../shared/entity/response.entity";

export class AuthDto {
    private constructor(
        public readonly email: string,
        public readonly password: string
    ) { }

    static create(props: { [key: string]: any }): ResponseEntity | AuthDto {
        let validateMessage: string[] = [];

        if (!props || typeof props !== 'object') validateMessage.push('El correo y la contraseña son requeridos');

        const { email, password } = props;
        if (!email) validateMessage.push('El correo es requerido');

        if (!regularExpression.email.test(email)) validateMessage.push('El correo no es válido');

        if (!password) validateMessage.push('La contraseña es requerida');

        if (validateMessage.length > 0) return ResponseEntity.create(messages.validate.fields({ messages: validateMessage }));

        return new AuthDto(email, password);
    }
}