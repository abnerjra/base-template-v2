import { prisma } from "../prisma";

type PermissionModule = {
    moduleId: number,
    permissionListId: number
}

export class PermissionModuleSeeder {
    private className: string;
    constructor() {
        this.className = this.constructor.name;
    }

    public seed = async () => {
        const permissions = await prisma.catPermissionList.findMany();
        const modules = await prisma.catModule.findMany();

        let permissionModule: PermissionModule[] = [];
        for (const module of modules) {
            for (const permission of permissions) {
                permissionModule.push({ moduleId: module.id, permissionListId: permission.id })
            }
        }

        let cont = 0;
        for (const content of permissionModule) {
            const exists = await prisma.permissionModule.findFirst({ where: { moduleId: content.moduleId, permissionListId: content.permissionListId } });
            if (!exists) {
                await prisma.permissionModule.create({ data: { moduleId: content.moduleId, permissionListId: content.permissionListId } });
                cont++;
            }
        }
        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${permissionModule.length}`);
    }
}