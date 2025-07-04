import { Request, Response } from "express";
import { CatalogRepository, ModuleCatalogUseCase, PermissionListCatalogUseCase, RoleCatalogUseCase, UserCatalogUseCase } from "../../domain";

export class CatalogController {
    constructor(private readonly repository: CatalogRepository) { }

    public modules = (req: Request, res: Response) => {
        new ModuleCatalogUseCase(this.repository).execute()
            .then(response => {
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

    public permissionsList = (req: Request, res: Response) => {
        new PermissionListCatalogUseCase(this.repository).execute()
            .then(response => {
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

    public roles = (req: Request, res: Response) => {
        new RoleCatalogUseCase(this.repository).execute()
            .then(response => {
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

    public users = (req: Request, res: Response) => {
        new UserCatalogUseCase(this.repository).execute()
            .then(response => {
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