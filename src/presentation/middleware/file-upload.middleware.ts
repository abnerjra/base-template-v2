import { Request, Response, NextFunction } from "express";

export class FileUploadMiddleware {

    static execute(req: Request, res: Response, next: NextFunction) {
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).json({
                severity: "error",
                message: 'No se seleccionaron archivos',
            });
            return;
        }

        // Ensure req.body is defined
        req.body = req.body || {};

        if (!Array.isArray(req.files.file)) {
            req.body.files = [req.files.file];
        } else {
            req.body.files = req.files.file;
        }

        next();
    }
}