interface IPermission {
    description: string;
    action: string;
    name: string;
}

interface IPermissionMap {
    [key: string]: IPermission[]
}

interface IRoles {
    id: number;
    name: string;
    key: string;
}

export class AuthEntity {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly token: string,
        public readonly iat: number,
        public readonly exp: number,
        public readonly roles: IRoles[],
        public readonly permissions: IPermissionMap[],
    ) { }

    static fromJson(obj: { [key: string]: any }): AuthEntity {
        const { id, name, lastName, email, token, iat, exp, roles = [], permissions = [] } = obj
        return new AuthEntity(id, name, lastName, email, token, iat, exp, roles, permissions)
    }
}