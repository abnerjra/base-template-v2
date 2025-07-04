import { prisma } from "../prisma";

type UserHasRole = {
    roleId: number,
    userId: number
}

export class UserHasRoleSeeder {
    private className: string;
    constructor() {
        this.className = this.constructor.name;
    }

    public seed = async () => {
        const roleRoot = await prisma.roles.findFirst({ where: { key: 'root' } });
        const roleAdmin = await prisma.roles.findFirst({ where: { key: 'admin' } });
        const roleUser = await prisma.roles.findFirst({ where: { key: 'user' } });

        const userSAdmin = await prisma.user.findFirst({ where: { email: 'user.sadmin@template.com' } })
        const userAdmin = await prisma.user.findFirst({ where: { email: 'user.admin@template.com' } })
        const user = await prisma.user.findFirst({ where: { email: 'user.one@template.com' } })

        let data: UserHasRole[] = [
            {
                roleId: roleRoot!.id,
                userId: userSAdmin!.id
            },
            {
                roleId: roleAdmin!.id,
                userId: userAdmin!.id
            },
            {
                roleId: roleUser!.id,
                userId: user!.id
            }
        ];

        let cont = 0;
        for (const content of data) {
            const exist = await prisma.userHasRole.count({ where: { roleId: content.roleId, userId: content.userId } });
            if (!exist) {
                await prisma.userHasRole.create({ data: content });
                cont++;
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${data.length}`);
    }
}