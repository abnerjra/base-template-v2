import { Request, Response } from "express";
import {
    AuthDto,
    AuthRepository,
    AuthUseCase,
    LogoutDto,
    LogoutUseCase,
    ResponseEntity
} from "../../domain";

export class AuthConroller {
    constructor(private readonly repository: AuthRepository) { }

    public login = (req: Request, res: Response) => {
        const dto = AuthDto.create(req.body);

        if (dto instanceof ResponseEntity) {
            const { statusCode, message, severity, data } = dto;
            res.status(statusCode).json({ severity, message, data });
            return
        }

        new AuthUseCase(this.repository).execute(dto!)
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

    public logout = (req: Request, res: Response) => {
        const authorizationHeader = req.header('Authorization') || '';

        const dto = LogoutDto.create(authorizationHeader);

        if (dto instanceof ResponseEntity) {
            const { statusCode, message, severity, data } = dto;
            res.status(statusCode).json({ severity, message, data });
            return
        }

        new LogoutUseCase(this.repository).execute(dto!)
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