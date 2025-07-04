import { messages } from "../../../config";
import { ResponseEntity } from "../../shared/entity/response.entity";

export class CreateModuleDto {
    constructor(
        public readonly name: string,
        public readonly key: string,
        public readonly description: string,
        public readonly permissions: string[],
        public readonly active?: boolean,
    ) { }

    static create(props: { [key: string]: any }): ResponseEntity | CreateModuleDto {
        let validateMessage: string[] = [];

        if (props === undefined || Object.keys(props).length === 0) return ResponseEntity.create(messages.validate.emptyFields);

        const { name, key, description, permissions, active = true } = props;

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

        if (permissions === null || permissions === undefined) {
            validateMessage.push('permissions: Es requerido');
        } else if (!Array.isArray(permissions)) {
            validateMessage.push('permissions: Debe ser un arreglo');
        } else if (permissions.length === 0) {
            validateMessage.push('permissions: Debe contener por lo menos un permiso');
        } else if (permissions.some((per: string) => typeof per !== 'string')) {
            validateMessage.push('permissions: Solo debe contener cadenas de texto');
        } else if (permissions.some((per: string) => per.trim() === '')) {
            validateMessage.push('permissions: No debe contener valores vacíos');
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

        return new CreateModuleDto(name, key, description, permissions, activeBoolean);
    }
}