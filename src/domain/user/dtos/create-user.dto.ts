import { messages, regularExpression } from "../../../config";
import { ResponseEntity } from "../../shared/entity/response.entity";

export class CreateUserDto {
    constructor(
        public readonly name: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly password: string,
        public readonly role: number[],
        public readonly active?: boolean,
    ) { }

    static create(props: { [key: string]: any }): ResponseEntity | CreateUserDto {
        let validateMessage: string[] = [];

        if (props === undefined || Object.keys(props).length === 0) return ResponseEntity.create(messages.validate.emptyFields);

        const { name, lastName, email, password, role, active = false } = props;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            validateMessage.push('name: Es requerido');
        } else if (name.length > 50) {
            validateMessage.push('name: Debe tener máximo 50 carácteres');
        }

        if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
            validateMessage.push('lastName: Es requerido');
        } else if (lastName.length > 100) {
            validateMessage.push('lastName: Debe tener máximo 100 carácteres');
        }

        if (!email || typeof email !== 'string' || email.trim() === '') {
            validateMessage.push('email: Es requerido');
        } else if (!regularExpression.email.test(email)) {
            validateMessage.push('email: Es inválido');
        }

        if (!password || typeof password !== 'string' || password.trim() === '') {
            validateMessage.push('password: Es requerido');
        } else if (!regularExpression.password.test(password)) {
            validateMessage.push('password: Debe contener al menos una letra mayúscula, un número, un carácter especial y tener al menos 8 caracteres de longitud');
        }

        if (role === undefined || role === null) {
            validateMessage.push('role: Es requerido');
        } else if (!Array.isArray(role)) {
            validateMessage.push('role: Debe ser un arreglo');
        } else if (!role.length) {
            validateMessage.push('role: Es necesario mandar por lo menos un role');
        } else if (role.some(r => typeof r !== 'number')) {
            validateMessage.push('role: Solo puedes mandar números dentro del arreglo');
        }

        let activeBoolean = active;
        if (typeof activeBoolean !== 'boolean') {
            switch (typeof activeBoolean) {
                case 'string':
                    activeBoolean = active.toLowerCase() === 'true' || active === '1' ? true : false;
                    break;
                case 'number':
                    activeBoolean = active === 1 ? true : false;
                    break;
            }
        }

        if (validateMessage.length) return ResponseEntity.create(messages.validate.fields({ messages: validateMessage }));

        return new CreateUserDto(name, lastName, email, password, role, activeBoolean);
    }
}