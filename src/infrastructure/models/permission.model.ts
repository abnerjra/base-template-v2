import { prisma } from "../../data/postgres/prisma";
import { BaseModel } from "./base.model";

export class PermissionModel extends BaseModel<typeof prisma.permissions> {
    constructor() {
        super(prisma.permissions, "permissions")
    }
}