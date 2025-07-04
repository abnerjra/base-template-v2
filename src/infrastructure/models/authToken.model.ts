import { prisma } from "../../data/postgres/prisma";
import { BaseModel } from "./base.model";

export class AuthTokenModel extends BaseModel<typeof prisma.authToken> {
    constructor() {
        super(prisma.authToken, "auth_token");
    }
}