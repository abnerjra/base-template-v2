import { messages } from "../../../config";
import { ResponseEntity } from "../../shared/entity/response.entity";

export class GetRolesDto {
    private constructor(
        public readonly limit: number,
        public readonly page: number,
        public readonly name?: string,
        public readonly description?: string,
        public readonly active?: boolean
    ) { }

    static create(props: { [key: string]: any }): ResponseEntity | GetRolesDto {
        let validateMessage: string[] = [];

        const { limit = 10, page = 1, name, description, active } = props


        if (isNaN(limit)) validateMessage.push('El parámetro limit debe ser un número');
        if (limit < 1) validateMessage.push('El parámetro limit debe ser mayor o igual a 1');

        if (isNaN(page)) validateMessage.push('El parámetro page debe ser un número');
        if (page < 1) validateMessage.push('El parámetro page debe ser mayor o igual a 1');

        if (typeof name !== 'undefined') {
            if (typeof name !== 'string' || name.trim().length === 0) {
                validateMessage.push('name: no puede estar vacio ni contener solo espacios');
            }
        }

        if (typeof description !== 'undefined') {
            if (typeof description !== 'string' || description.trim().length === 0) {
                validateMessage.push('description: no puede estar vacio ni contener solo espacios');
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

        if (validateMessage.length) return ResponseEntity.create(messages.validate.fields({ messages: validateMessage }));

        let limitNumber = Number(limit);
        let pageNumber = Number(page);

        return new GetRolesDto(limitNumber, pageNumber, name, description, activeBoolean);
    }
}