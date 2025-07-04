import { prisma } from "../prisma";

export class RoleSeeder {
    private className: string;
    constructor() {
        this.className = this.constructor.name;
    }

    public seed = async () => {
        const data = [
            {
                name: 'Super Admin',
                key: 'root',
                description: 'Rol del super administrador'
            },
            {
                name: 'Administrador',
                key: 'admin',
                description: 'Rol del administrador'
            },
            {
                name: 'Usuario',
                key: 'user',
                description: 'Rol de usuario'
            }
        ]

        let cont = 0;
        for (const role of data) {
            const exists = await prisma.roles.findFirst({ where: { key: role.key } });
            if (!exists) {
                await prisma.roles.create({ data: role });
                cont++;
            }
        }
        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${data.length}`);
    }
}