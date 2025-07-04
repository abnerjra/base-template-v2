import { prisma } from "../../data/postgres/prisma"
import { IModelContract, IQueryOptions, IUpdateOptions } from "../../domain/shared/contract/model.contract";
import { BaseModel } from "./base.model";

interface IRoleMap {
    id: number;
    name: string;
    key: string;
}

export class UserModel extends BaseModel<typeof prisma.user> {
    constructor() {
        super(prisma.user, "user");
    }

    /**
     * Retorna los roles asociados a un usuario.
     *
     * @param userId - ID del usuario.
     * @returns Lista de objetos `{ id, name, key }` con los roles asociados.
     */
    async hasRole(userId: number): Promise<IRoleMap[]> {
        const hasRole = await prisma.userHasRole.findMany({
            where: { userId: userId },
            select: {
                role: {
                    select: {
                        id: true,
                        name: true,
                        key: true
                    }
                }
            }
        });

        return hasRole.map(hr => hr.role);
    }

    /**
     * Asigna y elimina roles a un usuario determinado comparando los roles actuales con los nuevos recibidos.
     *
     * - Agrega roles que no existían.
     * - Elimina roles que ya no están en la nueva lista.
     *
     * @param userId - ID del usuario al que se le asignarán roles.
     * @param rolesToAssign - Lista de roles (`id`) de roles a asignar.
     */
    async handleRoleAssignment(
        userId: number,
        rolesToAssign: number[]
    ): Promise<void> {
        const existsRoles = await prisma.roles.findMany({
            where: { id: { in: rolesToAssign } }
        });

        if (existsRoles.length !== rolesToAssign.length) {
            throw new Error('The roles provided do not belong to the system role catalog');
        }

        const currentRoles = await prisma.userHasRole.findMany({
            where: { userId },
            select: { roleId: true }
        });

        const currentRoleIds = currentRoles.map(r => r.roleId);

        const rolesToRemove = currentRoleIds.filter(id => !rolesToAssign.includes(id));
        const rolesToAdd = rolesToAssign.filter(id => !currentRoleIds.includes(id));

        if (rolesToRemove.length) {
            await prisma.userHasRole.deleteMany({
                where: {
                    userId,
                    roleId: { in: rolesToRemove }
                }
            });
        }

        if (rolesToAdd.length) {
            const userRolesToAdd = rolesToAdd.map(roleId => ({
                userId,
                roleId
            }));

            await prisma.userHasRole.createMany({ data: userRolesToAdd });
        }
    }
}