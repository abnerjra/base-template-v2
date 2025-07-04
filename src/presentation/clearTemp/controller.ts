import { Request, Response } from "express";
import { ClearTempService } from "../../infrastructure";

export class ClearTempController {
    constructor(
        private readonly clearTmpService: ClearTempService
    ) { }

    clearTemp = (req: Request, res: Response) => {
        const type = req.params.type;
        const pathTemp = (req as any).pathTemp;

        const pathTempClear = `${pathTemp}/${type}`;

        this.clearTmpService.clearTmp(pathTempClear)
            .then((response) => {
                const { data, message, severity, statusCode } = response;
                res.status(statusCode).json({
                    severity,
                    message,
                    data
                });
                return;
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
                return;
            })
    }

    clearAllTemp = (req: Request, res: Response) => {
        const user = (req as any).auth;

        // const pathTempClear = `${user.id}`;
        const pathTempClear = '';

        this.clearTmpService.clearAllTmp(pathTempClear)
            .then((response) => {
                const { data, message, severity, statusCode } = response;
                res.status(statusCode).json({
                    severity,
                    message,
                    data
                });
                return;
            })
            .catch((error) => {
                console.log(error)
                res.status(500).json({ severity: 'error', message: error })
                return;
            })
    }
}