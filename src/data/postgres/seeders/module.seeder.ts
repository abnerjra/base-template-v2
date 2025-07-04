import { prisma } from "../prisma";

export class ModuleSeeder {
    private className: string;
    constructor() {
        this.className = this.constructor.name;
    }

    public seed = async () => {
        const data = [
            {
                name: 'Usuarios',
                key: 'user',
                description: 'Gestión de usuarios'
            },
            {
                name: 'Roles',
                key: 'role',
                description: 'Gestión de roles y permisos'
            },
            {
                name: 'Tablero',
                key: 'dashboard',
                description: 'Tablero Principal'
            },
        ]

        let cont = 0;
        for (const role of data) {
            const exists = await prisma.catModule.findFirst({ where: { key: role.key } });
            if (!exists) {
                await prisma.catModule.create({ data: role });
                cont++;
            }
        }
        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${data.length}`);
    }
}