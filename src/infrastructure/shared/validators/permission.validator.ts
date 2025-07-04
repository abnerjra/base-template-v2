import { messages } from "../../../config";
import { CatPermissionModel } from "../../models/cat-permission.model";

export class PermissionValidator {
    private catPermissionModel = new CatPermissionModel();

    existsPermit = async (permissions: string[]) => {
        let validateMsg: string[] = [];

        const validations = permissions.map(async (p) => {
            const existsPermit = await this.catPermissionModel.findOne({ where: { key: p } });
            if (!existsPermit) {
                validateMsg.push(`permissions: No existe el permiso ${p}`);
            }
        });

        await Promise.all(validations);

        if (validateMsg.length) {
            return {
                isValid: false,
                content: {
                    message: 'Validación de permisos',
                    severity: 'error',
                    statusCode: 400,
                    data: validateMsg
                }
            };
        }

        return { isValid: true };
    }
}