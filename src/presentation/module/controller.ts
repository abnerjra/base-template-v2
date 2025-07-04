import { Request, Response } from "express";
import {
    CreateModuleDto,
    CreateModuleUseCase,
    GetModuleDto,
    GetModulesDto,
    GetModulesUseCase,
    GetModuleUseCase,
    ModuleRepository,
    ResponseEntity,
    UpdateModuleDto,
    UpdateModuleUseCase
} from "../../domain";

export class ModuleController {
    constructor(private readonly repository: ModuleRepository) { }

    public getModules = (req: Request, res: Response) => {
        const dto = GetModulesDto.create(req.query);
        if (dto instanceof ResponseEntity) {
            const { data, message, severity, statusCode } = dto;
            res.status(statusCode).json({ severity, message, data })
            return;
        }

        new GetModulesUseCase(this.repository).execute(dto).
            then(response => {
                const { data, message, severity, statusCode, paginated } = response;
                res.status(statusCode).json({ severity, message, data, paginated })
                return;
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
                return;
            })
    }

    public getModule = (req: Request, res: Response) => {
        const id = +req.params.id;
        const dto = GetModuleDto.create(id);
        if (dto instanceof ResponseEntity) {
            const { data, message, severity, statusCode } = dto;
            res.status(statusCode).json({ severity, message, data })
            return;
        }

        new GetModuleUseCase(this.repository).execute(dto).
            then(response => {
                const { data, message, severity, statusCode } = response;
                res.status(statusCode).json({ severity, message, data })
                return;
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
                return;
            })
    }

    public createModule = (req: Request, res: Response) => {
        const dto = CreateModuleDto.create(req.body);
        if (dto instanceof ResponseEntity) {
            const { data, message, severity, statusCode } = dto;
            res.status(statusCode).json({ severity, message, data })
            return;
        }

        new CreateModuleUseCase(this.repository).execute(dto).
            then(response => {
                const { data, message, severity, statusCode } = response;
                res.status(statusCode).json({ severity, message, data })
                return;
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
                return;
            })
    }

    public updateModule = (req: Request, res: Response) => {
        const id = +req.params.id;
        const dto = UpdateModuleDto.create({ ...req.body, id });
        if (dto instanceof ResponseEntity) {
            const { data, message, severity, statusCode } = dto;
            res.status(statusCode).json({ severity, message, data })
            return;
        }

        new UpdateModuleUseCase(this.repository).execute(dto).
            then(response => {
                const { data, message, severity, statusCode } = response;
                res.status(statusCode).json({ severity, message, data })
                return;
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
                return;
            })
    }
}