import { Request, Response } from "express";
import { FileUploadService } from "../../infrastructure";

export class FileUploadController {
    constructor(
        private readonly fileUploadService: FileUploadService,
    ) { }

    uploadSingle = (req: Request, res: Response) => {
        const type = req.params.type;

        const pathTemp = (req as any).pathTemp;
        const file = req.body.files.at(0);

        const pathDestiny = `${pathTemp}/${type}`

        this.fileUploadService.uploadSingle(file, pathDestiny)
            .then((response) => {
                const { statusCode, message, severity, data } = response;
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