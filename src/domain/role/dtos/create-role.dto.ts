import { messages } from "../../../config";
import { ResponseEntity } from "../../shared/entity/response.entity";

type Permission = {
    moduleKey: string,
    permissions: string[]
}

export class CreateRoleDto {
    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly key: string,
        public readonly modules: Permission[],
        public readonly active?: boolean,
    ) { }

    static create(props: { [key: string]: any }): ResponseEntity | CreateRoleDto {
        let validateMessage: string[] = [];

        const { name, description, key, active, modules } = props;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            validateMessage.push('name: Es requerido');
        } else if (name.trim().length > 50) {
            validateMessage.push('name: Debe tener máximo 50 caráteres');
        }

        if (!description || typeof description !== 'string' || description.trim() === '') {
            validateMessage.push('description: Es requerido');
        } else if (description.trim().length > 255) {
            validateMessage.push('description: Debe tener máximo 255 caráteres');
        }

        if (!key || typeof key !== 'string' || key.trim() === '') {
            validateMessage.push('key: Es requerido');
        } else if (key.trim().length > 15) {
            validateMessage.push('key: Debe tener máximo 15 caráteres');
        }

        if (modules === undefined || modules === null) {
            validateMessage.push('modules: Los permisos por modulos son requeridos');
        } else if (!Array.isArray(modules)) {
            validateMessage.push("modules: Debe ser un arreglo");
        } else if (modules.length === 0) {
            validateMessage.push("modules: Es necesario mandar por lo menos un módulo con los permisos");
        } else {
            modules.forEach((mod: any, index: number) => {
                if (!mod.moduleKey || typeof mod.moduleKey !== 'string' || mod.moduleKey.trim() === '') {
                    validateMessage.push(`modules[${index}].moduleKey: Es requerido y debe ser una cadena no vacía`);
                }

                if (!Array.isArray(mod.permissions)) {
                    validateMessage.push(`modules[${index}].permissions: Debe ser un arreglo`);
                } else if (!mod.permissions.length) {
                    validateMessage.push(`modules[${index}].permissions: No puede estar vacío`);
                } else {
                    const invalids = mod.permissions.filter((p: string) => typeof p !== 'string' || p.trim() === '');
                    if (invalids.length) {
                        validateMessage.push(`modules[${index}].permissions: Todos los permisos deben ser cadenas no vacías`);
                    }
                }
            });
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

        return new CreateRoleDto(name, description, key, modules, activeBoolean);
    }
}