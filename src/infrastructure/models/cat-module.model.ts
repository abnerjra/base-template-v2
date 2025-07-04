import { prisma } from "../../data/postgres/prisma";
import { BaseModel } from "./base.model";

interface IPermission {
    description: string,
    action: string
}

export class CatModuleModel extends BaseModel<typeof prisma.catModule> {
    constructor() {
        super(prisma.catModule, "cat_module")
    }

    /**
     * Asigna y elimina permisos a un módulo determinado comparando los permisos actuales
     * con los nuevos recibidos.
     *
     * - Agrega permisos que no existían.
     * - Elimina permisos que ya no están en la nueva lista.
     *
     * @param moduleId - ID del módulo al que se le asignarán permisos.
     * @param permissions - Lista de claves (`key`) de permisos a asignar.
     */
    handlePermissionsAssignment = async (moduleId: number, permissions: string[]): Promise<void> => {
        const currentListPermits = await prisma.permissionModule.findMany({
            select: {
                permissionList: {
                    select: {
                        key: true
                    }
                }
            },
            where: {
                moduleId: moduleId
            }
        });

        const currentPermists = currentListPermits.map(crl => crl.permissionList.key);
        const newPermits = permissions.filter(p => !currentPermists.includes(p));
        const removePermits = currentPermists.filter(cp => !permissions.includes(cp));

        if (newPermits.length) {
            for (const permit of newPermits) {
                const permission = await prisma.catPermissionList.findFirst({ where: { key: permit }, select: { id: true } })
                await prisma.permissionModule.create({ data: { moduleId: moduleId, permissionListId: permission!.id } });
            }
        }

        if (removePermits.length) {
            for (const permit of removePermits) {
                const permission = await prisma.catPermissionList.findFirst({ where: { key: permit }, select: { id: true } })
                await prisma.permissionModule.delete({
                    where: {
                        moduleId_permissionListId: {
                            moduleId: moduleId,
                            permissionListId: permission!.id
                        }
                    }
                });
            }
        }
    }

    /**
     * Retorna los permisos actualmente asociados a un módulo.
     *
     * @param moduleId - ID del módulo.
     * @returns Lista de objetos `{ description, action }` con los permisos asociados.
     */
    hasPermissions = async (moduleId: number): Promise<IPermission[]> => {
        const permissions = await prisma.permissionModule.findMany({
            where: { moduleId: moduleId },
            select: {
                permissionList: {
                    select: {
                        name: true,
                        key: true
                    }
                }
            }
        });

        const associatedPermissions: IPermission[] = [];
        permissions.map(per => {
            associatedPermissions.push({ description: per.permissionList.name, action: per.permissionList.key })
        });

        return associatedPermissions;
    }
}