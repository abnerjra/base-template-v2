interface IPermission {
    description: string;
    action: string
}

export class ModuleEntity {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly key: string,
        public readonly description: string,
        public readonly active: boolean,
        public readonly permissions: IPermission[]
    ) { }

    static fromJson(props: { [key: string]: any }): ModuleEntity {
        const { id, name, key, description, active, permissions } = props;

        return new ModuleEntity(id, name, key, description, active, permissions);
    }
}