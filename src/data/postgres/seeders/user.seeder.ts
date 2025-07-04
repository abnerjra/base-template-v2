import { BcryptPlugin } from "../../../config";
import { prisma } from "../prisma";

export class UserSeeder {
    private className: string;

    constructor() {
        this.className = this.constructor.name
    }

    public seed = async () => {
        const data = [
            {
                name: 'User',
                lastName: 'Super admin',
                email: 'user.sadmin@template.com',
                active: true
            },
            {
                name: 'User',
                lastName: 'Admin',
                email: 'user.admin@template.com',
                active: true
            },
            {
                name: 'User',
                lastName: 'One',
                email: 'user.one@template.com',
                active: true
            }
        ];

        let cont = 0;
        for (const user of data) {
            const exists = await prisma.user.findFirst({ where: { email: user.email } })

            if (!exists) {
                const password = await BcryptPlugin.hash(user.email.split('@')[0])
                await prisma.user.create({ data: { ...user, password } })
                cont++;
            }
        }

        if (cont) console.log(`*** ${this.className}: ${cont} record(s) created out of a total of ${data.length}`);
    }
}