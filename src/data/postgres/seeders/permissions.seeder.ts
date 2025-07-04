import { prisma } from "../prisma";

type Permission = {
    name: string,
    action: string,
    description: string,
    moduleId: number,
    roleId: number
}

export class PermissionsSeeder {
    private className: string;
    constructor() {
        this.className = this.constructor.name;
    }

    public seed = async () => {
        const permissionsList = await prisma.catPermissionList.findMany();
        const modules = await prisma.catModule.findMany({ select: { id: true, key: true } });

        const roleRoot = await prisma.roles.findFirst({ where: { key: 'root' } });
        const roleAdmin = await prisma.roles.findFirst({ where: { key: 'admin' } });
        const roleUser = await prisma.roles.findFirst({ where: { key: 'user' } });

        let permissionsRole: Permission[] = [];

        // Root
        for (const module of modules) {
            for (const pl of permissionsList) {
                permissionsRole.push({
                    name: `${roleRoot!.key}.${module.key}.${pl.key}`,
                    action: pl.key,
                    description: pl.name,
                    moduleId: module.id,
                    roleId: roleRoot!.id
                })
            }
        }

        // Admin
        for (const module of modules) {
            for (const pl of permissionsList) {
                if (module.key === 'user' || module.key === 'dashboard') {
                    permissionsRole.push({
                        name: `${roleAdmin!.key}.${module.key}.${pl.key}`,
                        action: pl.key,
                        description: pl.name,
                        moduleId: module.id,
                        roleId: roleAdmin!.id
                    })
                }
            }
        }

        // User
        for (const module of modules) {
            for (const pl of permissionsList) {
                if (module.key === 'dashboard') {
                    if (pl.key === 'read') {
                        permissionsRole.push({
                            name: `${roleUser!.key}.${module.key}.${pl.key}`,
                            action: pl.key,
                            description: pl.name,
                            moduleId: module.id,
                            roleId: roleUser!.id
                        })
                    }
                }
            }
        }

        let cont = 0;
        for (const content of permissionsRole) {
            const exists = await prisma.permissions.findFirst({ where: { name: content.name } });
            if (!exists) {
                const createdPermission = await prisma.permissions.create({
                    data: {
                        name: content.name, action: content.action, description: content.description, moduleId: content.moduleId
                    }
                });

                const roleHasPermission = await prisma.roleHasPermissions.findFirst({ where: { roleId: content.roleId, permissionId: createdPermission.id } })
                if (!roleHasPermission) {
                    await prisma.roleHasPermissions.create({ data: { roleId: content.roleId, permissionId: createdPermission.id } })
                }
                cont++;
            }
        }

        if (cont > 0) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${permissionsRole.length}`);
    }
}