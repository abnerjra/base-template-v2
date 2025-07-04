import { prisma } from "../../data/postgres/prisma";
import { BaseModel } from "./base.model";

export class CatPermissionModel extends BaseModel<typeof prisma.catPermissionList> {
    constructor() {
        super(prisma.catPermissionList, "cat_permission_list");
    }
}