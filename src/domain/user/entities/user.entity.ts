interface IUserHasRoles {
    id: number,
    name: string,
    key: string
}

export class UserEntity {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly active: boolean,
        public readonly roles?: IUserHasRoles[]
    ) { }

    static fromJson(props: { [key: string]: any }): UserEntity {
        const { id, name, lastName, email, active, roles } = props
        return new UserEntity(id, name, lastName, email, active, roles)
    }
}