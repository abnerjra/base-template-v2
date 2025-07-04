interface IPermissionMap {
    description: string;
    action: string;
}

interface IPermission {
    [key: string]: IPermissionMap[]
}

export class RoleEntity {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly key: string,
        public readonly description: string,
        public readonly active: boolean,
        public readonly permissions?: IPermission[],
    ) { }

    static fromJson(props: { [key: string]: any }): RoleEntity {
        const { id, name, key, description, active, permissions } = props;
        return new RoleEntity(id, name, key, description, active, permissions)
    }
}