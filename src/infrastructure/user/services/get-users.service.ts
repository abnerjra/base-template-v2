import { messages } from "../../../config";
import { GetUsersDto, ResponseEntity, UserEntity } from "../../../domain";
import { UserModel } from "../../models/user.model";

export class GetUsersService {
    private userModel = new UserModel();

    async execute(dto: GetUsersDto): Promise<ResponseEntity> {
        try {
            const { limit, page, active, lastName, name, role } = dto;

            let filters: { [key: string]: any } = {};
            filters.skip = (page - 1) * limit;
            filters.take = limit;
            if (name) filters.where = { name: { contains: name, mode: 'insensitive' } };
            if (lastName) filters.where = { lastName: { contains: lastName, mode: 'insensitive' } };
            if (role) filters.where = { userHasRole: { some: { roleId: role } } };

            const { skip, take, orderBy, ...filtersCount } = filters;

            const [totalRecords, users] = await Promise.all([
                await this.userModel.count(filtersCount),
                await this.userModel.findAll(filters)
            ])
            if (users.length === 0) return ResponseEntity.create(messages.response.empty);

            const data = await Promise.all(
                users.map(async (user) => {
                    const roles = await this.userModel.hasRole(user.id);
                    return UserEntity.fromJson({ ...user, roles });
                })
            );

            const total = totalRecords;
            const totalPerPage = users.length
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

            if (error instanceof Error) {
                return ResponseEntity.create(messages.error.notFound({ message: error.message }));
            }
            return ResponseEntity.create(messages.error.serverError);
        }
    }
}