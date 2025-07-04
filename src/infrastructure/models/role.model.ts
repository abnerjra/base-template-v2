import { prisma } from "../../data/postgres/prisma";
import { BaseModel } from "./base.model";

interface Permission {
    description: string,
    action: string
}

interface PermissionMap {
    [key: string]: Permission[]
}

type ModulesToAssing = {
    moduleKey: string,
    permissions: string[]
}

type RequestPermissions = {
    action: string,
    moduleId: number,
    description: string
}

export class RoleModel extends BaseModel<typeof prisma.roles> {
    constructor() {
        super(prisma.roles, "roles")
    }

    /**
     * Obtiene los permisos actuales asignados a un rol, organizados por módulo.
     *
     * @param roleId - ID del rol a consultar.
     * @returns Un mapa donde la clave es el módulo (`moduleKey`) y el valor es un arreglo de permisos.
     */
    async hasPermission(roleId: number): Promise<PermissionMap> {
        const query = {
            select: {
                name: true,
                action: true,
                module: {
                    select: {
                        key: true,
                        permissionsModule: {
                            select: {
                                permissionList: {
                                    select: {
                                        name: true,
                                        key: true
                                    },
                                },
                            },
                        },
                    },
                },
            },
            where: {
                active: true,
                roleHasPermission: {
                    some: { roleId: roleId },
                }
            }
        }

        const permissions = await prisma.permissions.findMany(query)

        const result = permissions.map(permission => {
            const matchingPermission = permission.module.permissionsModule.find(pm =>
                pm.permissionList.key.includes(permission.action)
            )

            return {
                action: permission.action,
                moduleKey: permission.module.key,
                description: matchingPermission!.permissionList.name
            }
        })

        const associatedPermissions: PermissionMap = {}
        for (const element of result) {
            if (!associatedPermissions[element.moduleKey]) {
                associatedPermissions[element.moduleKey] = []
            }

            associatedPermissions[element.moduleKey].push({
                description: element.description,
                action: element.action
            })
        }

        return associatedPermissions
    }

    /**
     * Asigna y elimina permisos de un rol comparando el estado actual en base de datos con los nuevos permisos enviados.
     *
     * - Crea nuevos permisos si no existen.
     * - Restaura permisos desactivados.
     * - Desactiva y elimina relaciones de permisos eliminados.
     *
     * @param roleId - ID del rol al que se asignan los permisos.
     * @param modulesToAssing - Lista de módulos y permisos que deben estar asignados al rol.
     * 
     * @example
     * modulesToAssing
     * "modules": [
     *   {
     *      "moduleKey": "role",
     *      "permissions": [
     *         "read"
     *     ]
     *  }
     * ]
     */
    handlePermissionsAssignment = async (
        roleId: number,
        modulesToAssing: ModulesToAssing[]
    ): Promise<void> => {
        try {
            const currentRole = await prisma.roles.findFirst({ where: { id: roleId } })

            const currentPermits = await prisma.roleHasPermissions.findMany({
                where: { roleId: roleId }
            })
            const currentPermitsIds = currentPermits.map((element) => element.permissionId)

            const permissionsInBD = await prisma.permissions.findMany({
                select: { action: true, moduleId: true, description: true },
                where: { id: { in: currentPermitsIds }, active: true }
            })

            const requestPermissions: RequestPermissions[] = []
            for (const module of modulesToAssing) {
                for (const key of module.permissions) {
                    const moduleDB = await prisma.catModule.findFirst({ where: { key: module.moduleKey } });
                    const permission = await prisma.catPermissionList.findFirst({ where: { key } })
                    requestPermissions.push({ action: key, moduleId: moduleDB!.id, description: permission!.name })
                }
            }

            const isEqual = (permissionsInBD: RequestPermissions, requestPermissions: RequestPermissions) =>
                permissionsInBD.action === requestPermissions.action && permissionsInBD.moduleId === requestPermissions.moduleId;

            const newPermits = requestPermissions.filter((item2) => !permissionsInBD.some((item1) => isEqual(item1, item2)))

            const removedPermits = permissionsInBD.filter((item1) => !requestPermissions.some((item2) => isEqual(item1, item2)))

            if (newPermits.length) {
                for (const permit of newPermits) {
                    const moduleName = await prisma.catModule.findFirst({ where: { id: permit.moduleId } })

                    const permission = {
                        ...permit,
                        name: `${currentRole!.key}.${moduleName!.key}.${permit.action}`
                    }

                    const existPermission = await prisma.permissions.findFirst({ where: permission })
                    if (existPermission) {
                        await prisma.permissions.update({
                            where: { id: existPermission.id },
                            data: { active: true, deletedAt: null }
                        })

                        const existsRelation = await prisma.roleHasPermissions.findFirst({ where: { roleId: roleId, permissionId: existPermission.id } })
                        if (!existsRelation) {
                            await prisma.roleHasPermissions.create({
                                data: {
                                    roleId: roleId,
                                    permissionId: existPermission.id
                                }
                            })
                        }
                    } else {
                        const newPermission = await prisma.permissions.create({
                            data: permission
                        })

                        await prisma.roleHasPermissions.create({
                            data: {
                                roleId: roleId,
                                permissionId: newPermission.id
                            }
                        })
                    }
                }
            }

            if (removedPermits.length) {
                for (const permission of removedPermits) {
                    const moduleName = await prisma.catModule.findFirst({ where: { id: permission.moduleId } })

                    const checkPermission = await prisma.permissions.findFirst({
                        where: {
                            ...permission,
                            name: `${currentRole!.key}.${moduleName!.key}.${permission.action}`,
                        }
                    })

                    if (checkPermission) {
                        await prisma.permissions.update({
                            where: { id: checkPermission.id },
                            data: { active: false, deletedAt: new Date() }
                        })

                        await prisma.roleHasPermissions.delete({
                            where: {
                                roleId_permissionId: {
                                    roleId: roleId,
                                    permissionId: checkPermission.id
                                }
                            }
                        })
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}