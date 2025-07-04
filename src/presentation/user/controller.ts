import { Request, Response } from "express";
import {
    CreateUserDto,
    CreateUserUseCase,
    GetUsersDto,
    GetUsersUseCase,
    GetUserUseCase,
    ResponseEntity,
    UpdateUserDto,
    UpdateUserUseCase,
    UserRepository
} from "../../domain";

export class UserController {
    constructor(private readonly repository: UserRepository) { }

    public getAll = (req: Request, res: Response) => {
        const dto = GetUsersDto.create(req.query);

        if (dto instanceof ResponseEntity) {
            const { statusCode, message, severity, data } = dto;
            res.status(statusCode).json({ severity, message, data });
            return
        }

        new GetUsersUseCase(this.repository).execute(dto!)
            .then(resp => {
                const { data, message, severity, statusCode, paginated } = resp
                res.status(statusCode).json({ severity, message, data, paginated })
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
                return;
            })
    }

    public getById = (req: Request, res: Response) => {
        const id = +req.params.id;
        new GetUserUseCase(this.repository).execute(id)
            .then(resp => {
                const { data, message, severity, statusCode } = resp
                res.status(statusCode).json({ severity, message, data })
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
                return;
            })
    }

    public create = (req: Request, res: Response) => {
        const dto = CreateUserDto.create(req.body);
        if (dto instanceof ResponseEntity) {
            const { statusCode, message, severity, data } = dto;
            res.status(statusCode).json({ severity, message, data });
            return
        }

        new CreateUserUseCase(this.repository).execute(dto!)
            .then(resp => {
                const { data, message, severity, statusCode } = resp
                res.status(statusCode).json({ severity, message, data })
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
                return;
            })
    }

    public update = (req: Request, res: Response) => {
        const id = req.params.id;
        const dto = UpdateUserDto.create({ ...req.body, id });
        if (dto instanceof ResponseEntity) {
            const { statusCode, message, severity, data } = dto;
            res.status(statusCode).json({ severity, message, data });
            return
        }

        new UpdateUserUseCase(this.repository).execute(dto!)
            .then(resp => {
                const { data, message, severity, statusCode } = resp
                res.status(statusCode).json({ severity, message, data })
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
                return;
            })
    }
}