import { Request, Response } from "express";
import {
    CreateRoleDto,
    CreateRoleUseCase,
    GetRoleDto,
    GetRolesDto,
    GetRolesUseCase,
    GetRoleUseCase,
    ResponseEntity,
    RoleRepository,
    UpdateRoleDto,
    UpdateRoleUseCase
} from "../../domain";

export class RoleController {
    constructor(private readonly repository: RoleRepository) { }

    public getRoles = (req: Request, res: Response) => {
        const dto = GetRolesDto.create(req.query)

        if (dto instanceof ResponseEntity) {
            const { statusCode, message, severity, data } = dto;
            res.status(statusCode).json({ severity, message, data });
            return
        }

        new GetRolesUseCase(this.repository).execute(dto)
            .then(response => {
                const { statusCode, message, severity, data } = response;
                res.status(statusCode).json({ severity, message, data });
                return
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
                return;
            })
    }

    public getRole = (req: Request, res: Response) => {
        const id = +req.params.id;
        const dto = GetRoleDto.create(id);
        if (dto instanceof ResponseEntity) {
            const { statusCode, message, severity, data } = dto;
            res.status(statusCode).json({ severity, message, data });
            return
        }

        new GetRoleUseCase(this.repository).execute(dto)
            .then(response => {
                const { statusCode, message, severity, data } = response;
                res.status(statusCode).json({ severity, message, data });
                return
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
                return;
            })
    }

    public createRole = (req: Request, res: Response) => {
        const dto = CreateRoleDto.create(req.body);
        if (dto instanceof ResponseEntity) {
            const { statusCode, message, severity, data } = dto;
            res.status(statusCode).json({ severity, message, data });
            return
        }

        new CreateRoleUseCase(this.repository).execute(dto)
            .then(response => {
                const { statusCode, message, severity, data } = response;
                res.status(statusCode).json({ severity, message, data });
                return
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
                return;
            })
    }

    public updateRole = (req: Request, res: Response) => {
        const id = req.params.id;
        const dto = UpdateRoleDto.create({ ...req.body, id });
        if (dto instanceof ResponseEntity) {
            const { statusCode, message, severity, data } = dto;
            res.status(statusCode).json({ severity, message, data });
            return
        }

        new UpdateRoleUseCase(this.repository).execute(dto)
        .then(response => {
                const { statusCode, message, severity, data } = response;
                res.status(statusCode).json({ severity, message, data });
                return
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
                return;
            })
    }
}