import { prisma } from "../prisma";

export class PermissionListSeeder {
    private className: string;
    constructor() {
        this.className = this.constructor.name;
    }

    public seed = async () => {
        const data = [
            {
                name: 'Crear',
                key: 'create'
            },
            {
                name: 'Leer',
                key: 'read'
            },
            {
                name: 'Actualizar',
                key: 'update'
            },
            {
                name: 'Eliminar',
                key: 'delete'
            }
        ]

        let cont = 0;
        for (const role of data) {
            const exists = await prisma.catPermissionList.findFirst({ where: { key: role.key } });
            if (!exists) {
                await prisma.catPermissionList.create({ data: role });
                cont++;
            }
        }
        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${data.length}`);
    }
}