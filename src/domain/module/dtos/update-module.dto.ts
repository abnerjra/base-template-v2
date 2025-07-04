import { messages, regularExpression } from "../../../config";
import { ResponseEntity } from "../../shared/entity/response.entity";

export class UpdateModuleDto {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly key: string,
        public readonly description: string,
        public readonly permissions: string[],
        public readonly active?: boolean,
    ) { }

    static create(props: { [key: string]: any }): ResponseEntity | UpdateModuleDto {
        let validateMessage: string[] = [];

        if (props === undefined || Object.keys(props).length === 0) return ResponseEntity.create(messages.validate.emptyFields);

        const { id, name, key, description, permissions, active = true } = props;

        const idString = String(id).trim();
        const idNumber = Number(idString);

        if (!idString) {
            validateMessage.push('ID: Es requerido');
        } else if (!regularExpression.number.test(idString)) {
            validateMessage.push('ID: Debe ser un número entero positivo sin letras ni símbolos');
        } else if (isNaN(idNumber)) {
            validateMessage.push('ID: No es un número válido');
        } else if (idNumber <= 0) {
            validateMessage.push('ID: Debe ser mayor a cero');
        }

        if (!name || typeof name !== 'string' || name.trim() === '') {
            validateMessage.push('name: Es requerido');
        } else if (name.trim().length > 100) {
            validateMessage.push('name: Debe tener máximo 100 carácteres');
        }

        if (!key || typeof key !== 'string' || key.trim() === '') {
            validateMessage.push('key: Es requerido');
        } else if (key.trim().length > 15) {
            validateMessage.push('key: Debe tener máximo 15 carácteres');
        }

        if (!description || typeof description !== 'string' || description.trim() === '') {
            validateMessage.push('description: Es requerido');
        } else if (description.trim().length > 255) {
            validateMessage.push('description: Debe tener máximo 255 carácteres');
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

        return new UpdateModuleDto(idNumber, name, key, description, permissions, activeBoolean);
    }
}