import { messages } from "../../../config";
import { GetModulesDto, ResponseEntity } from "../../../domain";
import { ModuleEntity } from "../../../domain/module/entities/module.entity";
import { CatModuleModel } from "../../models/cat-module.model";

export class GetModulesService {
    private catModule = new CatModuleModel();
    async execute(dto: GetModulesDto): Promise<ResponseEntity> {
        try {
            const { limit, page, active, description, name } = dto;

            const filters: { [key: string]: any } = {};
            filters.skip = (page - 1) * limit;
            filters.take = limit;
            filters.orderBy = { name: 'asc' };
            if (name) filters.where = { name: { contains: name, mode: 'insensitive' } }
            if (description) filters.where = { description: { contains: description, mode: 'insensitive' } }
            if (active) filters.where = { active }

            const { skip, take, orderBy, ...filtersCount } = filters;

            const [totalRecords, getModules] = await Promise.all([
                await this.catModule.count(filtersCount),
                await this.catModule.findAll(filters)
            ])

            if (getModules.length === 0) return ResponseEntity.create(messages.response.empty);

            const data = await Promise.all(
                getModules.map(async (m) => {
                    const permissions = await this.catModule.hasPermissions(m.id);
                    return ModuleEntity.fromJson({ ...m, permissions });
                })
            )

            const total = totalRecords;
            const totalPerPage = getModules.length
            const paginated = {
                totalRecords: total,
                totalPerPage: totalPerPage,
                totalPages: Math.ceil(total / limit),
                page,
                limit
            }
            return ResponseEntity.create({ ...messages.response.reads, data, paginated });
        } catch (error) {
            console.log(error);

            if (error instanceof ResponseEntity) {
                return ResponseEntity.create(messages.error.notFound({ message: error.message }))
            }
            return ResponseEntity.create(messages.error.serverError);
        }
    }
}