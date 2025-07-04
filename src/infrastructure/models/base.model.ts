import { prisma } from "../../data/postgres/prisma";

interface IQueryOptions {
    select?: object;
    where?: object;
    orderBy?: object;
    skip?: number;
    take?: number;
}

interface IUpdateOptions {
    data: object,
    where: object
}

/**
 * Clase genérica BaseModel para realizar operaciones comunes sobre cualquier entidad de Prisma.
 * Implementa métodos reutilizables como `findOne`, `findAll`, `create`, `update`, `count` y
 * búsqueda con `unaccent` para búsquedas insensibles a acentos.
 *
 * @template T - El tipo de modelo de Prisma a manejar.
 */
export class BaseModel<T> {
    /**
     * @param model - Cliente Prisma delegado (por ejemplo, prisma.user, prisma.roles, etc.).
     * @param tableName - Nombre de la tabla en la base de datos, usado para consultas SQL puras.
     */
    constructor(
        private readonly model: T,
        private readonly tableName: string
    ) { }

    /**
     * Busca un único registro con las condiciones especificadas.
     * Si detecta uso de búsqueda insensible a acentos (`unaccent`), realiza una consulta raw.
     *
     * @param queryOptions - Opciones de búsqueda.
     * @returns Registro encontrado o null.
     */
    async findOne(queryOptions: IQueryOptions): Promise<any> {
        const { where, select } = queryOptions;

        // const needsUnaccent = this.hasUnaccentQuery(where);
        // if (needsUnaccent) return this.findAllWithUnaccent({ where });

        const search: any = {};
        if (where) search.where = where;
        if (select) search.select = select;
        
        return await (this.model as any).findFirst(search);
    }

    /**
     * Busca un registro por su ID primario.
     *
     * @param id - ID único del registro.
     * @returns Registro encontrado o null.
     */
    async findById(id: number): Promise<any> {
        const record = await (this.model as any).findUnique({ where: { id } });
        return record;
    }

    /**
     * Obtiene múltiples registros con filtros opcionales.
     * Soporta paginación, ordenamiento y selección de campos.
     *
     * @param queryOptions - Opciones de búsqueda.
     * @returns Lista de registros encontrados.
     */
    async findAll(queryOptions: IQueryOptions): Promise<any[]> {
        const { where, skip, take, orderBy, select } = queryOptions;

        const needsUnaccent = this.hasUnaccentQuery(where);
        if (needsUnaccent) return this.findAllWithUnaccent({ where, skip, take });

        const search: any = {};
        if (where) search.where = where;
        if (skip !== undefined) search.skip = skip;
        if (take !== undefined) search.take = take;
        if (orderBy) search.orderBy = orderBy;
        if (select) search.select = select;

        return await (this.model as any).findMany(search);
    }

    /**
     * Devuelve el total de registros con filtros opcionales.
     *
     * @param queryOptions - Opciones de búsqueda.
     * @returns Total de registros.
     */
    async count(queryOptions: IQueryOptions): Promise<any> {
        const { where, select } = queryOptions;

        const needsUnaccent = this.hasUnaccentQuery(where);
        if (needsUnaccent) return this.findAllWithUnaccent({ where });

        const search: any = {};
        if (where) search.where = where;
        if (select) search.select = select;

        return await (this.model as any).count(search);
    }

    /**
     * Crea un nuevo registro en la tabla.
     *
     * @param data - Datos a insertar.
     * @returns Registro creado.
     */
    async create(data: object): Promise<any> {
        return await (this.model as any).create({ data });
    }

    /**
     * Actualiza un registro existente.
     *
     * @param updateOptions - Condición y datos a actualizar.
     * @returns Registro actualizado.
     */
    async update(updateOptions: IUpdateOptions): Promise<any> {
        return await (this.model as any).update({ where: updateOptions.where, data: updateOptions.data });
    }

    /**
     * Verifica si la condición de búsqueda incluye operadores que requieren `unaccent`.
     *
     * @param where - Condiciones del filtro.
     * @returns `true` si requiere uso de `unaccent`, de lo contrario `false`.
     */
    private hasUnaccentQuery(where: any): boolean {
        if (!where) return false;
        for (const field in where) {
            const condition = where[field];
            if (typeof condition === 'object' && condition?.contains && condition?.mode === 'insensitive') {
                return true;
            }
        }
        return false;
    }

    /**
     * Ejecuta una consulta raw SQL usando `unaccent` para campos con búsqueda insensible.
     * También soporta paginación (`skip`, `take`).
     *
     * @param where - Condiciones de búsqueda.
     * @param skip - Cantidad de registros a omitir.
     * @param take - Cantidad de registros a retornar.
     * @returns Lista de registros.
     */
    private async findAllWithUnaccent({ where, skip, take }: any): Promise<any[]> {
        const filters: string[] = [];
        const values: unknown[] = [];
        let paramIndex = 1;

        // Construir filtros
        for (const field in where) {
            const condition = where[field];
            if (typeof condition === 'object' && condition?.contains) {
                filters.push(`unaccent("${field}") ILIKE unaccent($${paramIndex})`);
                values.push(`%${condition.contains}%`);
            } else {
                filters.push(`unaccent("${field}") = unaccent($${paramIndex})`);
                values.push(condition);
            }

            paramIndex++;
        }

        const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

        // Condicionalmente agregar OFFSET y LIMIT
        let paginationClause = '';
        if (typeof skip === 'number') {
            paginationClause += ` OFFSET $${paramIndex}`;
            values.push(skip);
            paramIndex++;
        }

        if (typeof take === 'number') {
            paginationClause += ` LIMIT $${paramIndex}`;
            values.push(take);
            paramIndex++;
        }

        const query = `SELECT * FROM "${this.tableName}" ${whereClause} ${paginationClause}`;

        return await prisma.$queryRawUnsafe(query, ...values);
    }
}
