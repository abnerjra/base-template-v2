export interface IQueryOptions {
    select?: object;
    where?: object;
    orderBy?: object;
    skip?: number;
    take?: number;
}

export interface IUpdateOptions {
    where: object;
    data: object;
}

export interface IModelContract<T> {
    findOneResource(queryOptions: IQueryOptions): Promise<T | null>;
    findByIdResource(id: number): Promise<T | null>
    findAllResource(queryOptions?: IQueryOptions): Promise<T[]>;
    createResource(data: Partial<T>): Promise<T>;
    updateResource(updateOptions: IUpdateOptions): Promise<T>;
}