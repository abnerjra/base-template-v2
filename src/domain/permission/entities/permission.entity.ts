export class PermissionEntity {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly key: string,
        public readonly active: boolean,
    ) { }

    static fromJson(obj: { [key: string]: any }): PermissionEntity {
        const { id, name, key, active } = obj;
        return new PermissionEntity(id, name, key, active)
    }
}