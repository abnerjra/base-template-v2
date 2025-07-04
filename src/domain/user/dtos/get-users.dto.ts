import { messages } from "../../../config";
import { ResponseEntity } from "../../shared/entity/response.entity";

export class GetUsersDto {
    private constructor(
        public readonly limit: number,
        public readonly page: number,
        public readonly name?: string,
        public readonly lastName?: number,
        public readonly active?: boolean,
        public readonly role?: number,
    ) { }

    static create(props: { [key: string]: any }): ResponseEntity | GetUsersDto {
        let validateMessage: string[] = [];

        const { limit = 10, page = 1, name, lastName, active, role } = props

        if (isNaN(limit)) validateMessage.push('El parámetro limit debe ser un número');
        if (limit < 1) validateMessage.push('El parámetro limit debe ser mayor o igual a 1');

        if (isNaN(page)) validateMessage.push('El parámetro page debe ser un número');
        if (page < 1) validateMessage.push('El parámetro page debe ser mayor o igual a 1');

        if (typeof name !== 'undefined') {
            if (typeof name !== 'string' || name.trim().length === 0) {
                validateMessage.push('El campo name no puede estar vacio ni contener solo espacios');
            }
        }

        if (typeof lastName !== 'undefined') {
            if (typeof lastName !== 'string' || lastName.trim().length === 0) {
                validateMessage.push('El campo lastName no puede estar vacio ni contener solo espacios');
            }
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

        let roleNumber: number | undefined;
        if (role) {
            if (isNaN(role)) {
                validateMessage.push('El campo role debe ser un número');
            }
            roleNumber = Number(role);
        }

        if (validateMessage.length) return ResponseEntity.create(messages.validate.fields({ messages: validateMessage }));

        let limitNumber = Number(limit);
        let pageNumber = Number(page);

        return new GetUsersDto(limitNumber, pageNumber, name, lastName, activeBoolean, roleNumber);
    }
}