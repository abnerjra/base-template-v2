import { messages } from "../../../config";
import { CatPermissionModel } from "../../models/cat-permission.model";
import { CatModuleModel } from "../../models/cat-module.model";

interface IModules {
    moduleKey: string,
    permissions: string[]
}

export class ValidateModulePermission {
    private moduleModel = new CatModuleModel();
    private catPermissionModel = new CatPermissionModel();

    handleValidate = async (modules: IModules[]) => {
        let validateMsg: string[] = [];

        // Verificar módulos duplicados
        const seenModules = new Set<string>();
        let duplicated = false;
        for (const m of modules) {
            if (seenModules.has(m.moduleKey)) {
                duplicated = true;
                validateMsg.push(`El módulo ${m.moduleKey} está duplicado`);
            } else {
                seenModules.add(m.moduleKey);
            }
        }

        if (duplicated) {
            if (validateMsg.length) {
                return {
                    isValid: false,
                    message: messages.validate.personalized({
                        message: 'Validación de módulos',
                        severity: 'error',
                        statusCode: 400,
                        data: validateMsg
                    })
                };
            }
        }

        validateMsg = [];
        // Validar existencia de módulos y permisos
        const validations = modules.map(async (m) => {
            const existsModule = await this.moduleModel.findOne({ where: { key: m.moduleKey } });
            if (!existsModule) {
                validateMsg.push(`No existe un modulo con la clave ${m.moduleKey}`);
            } else {
                const permissionValidations = m.permissions.map(async (p) => {
                    const existsPermit = await this.catPermissionModel.findOne({ where: { key: p } });
                    if (!existsPermit) {
                        validateMsg.push(`No existe el permiso ${p} dentro de ${m.moduleKey}`);
                    }
                });

                await Promise.all(permissionValidations);
            }
        });

        await Promise.all(validations);

        if (validateMsg.length) {
            return {
                isValid: false,
                message: messages.validate.personalized({
                    message: 'Validación de módulos y permisos',
                    severity: 'error',
                    statusCode: 400,
                    data: validateMsg
                })
            };
        }

        return { isValid: true };
    }
}