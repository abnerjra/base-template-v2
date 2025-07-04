import { NextFunction, Request, Response } from "express";
import { JwtPlugin } from "../../config";
import { AuthTokenModel, UserModel } from "../../infrastructure";
import { UserEntity } from "../../domain";

/**
 * Middleware de autenticación para proteger rutas privadas.
 * 
 * Este middleware realiza las siguientes tareas:
 * 1. Verifica que exista un header `Authorization` válido de tipo Bearer.
 * 2. Extrae y valida el token JWT.
 * 3. Revisa que el token esté activo en la base de datos (no revocado).
 * 4. Carga los datos del usuario desde la base de datos y los adjunta a `req.auth`.
 * 5. Establece un identificador temporal `req.pathTemp` basado en el ID del usuario y el token.
 * 
 * Si alguna de las validaciones falla, responde con un código 401 (no autorizado) o 500 si ocurre un error interno.
 *
 * @param req - Objeto de solicitud HTTP de Express.
 * @param res - Objeto de respuesta HTTP de Express.
 * @param next - Función que llama al siguiente middleware.
 */
export class AuthMiddleware {
    static async execute(req: Request, res: Response, next: NextFunction) {
        const authorizationHeader = req.header('Authorization');
        if (!authorizationHeader) {
            res.status(401).json({ message: "Es necesario proporcionar el token de acceso", severity: "error" });
            return;
        }
        if (!authorizationHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: "Es necesario mandar el token de tipo Bearer", severity: "error" });
            return;
        }

        const token = authorizationHeader.split(' ')[1] || '';
        try {
            const userModel = new UserModel();
            const authTokenModel = new AuthTokenModel();

            const activeToken = await authTokenModel.findOne({ where: { token, revoked: false } })
            if (!activeToken) {
                res.status(401).json({ severity: 'error', message: 'El token de acceso del usuario ha expirado' });
                return;
            }

            const payload = await JwtPlugin.verifyToken<{ id: number }>(token);
            if (!payload) {
                res.status(401).json({ severity: 'error', message: 'El token de acceso ha expirado' });
                return;
            }

            const user = await userModel.findOne({ where: { id: payload.id } })

            const userAuth = UserEntity.fromJson(user);
            (req as any).auth = userAuth;
            (req as any).pathTemp = `${userAuth.id}/${token.slice(-30)}`;

            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({ severity: 'error', message: 'Internal server error' });
            return;
        }
    }
}