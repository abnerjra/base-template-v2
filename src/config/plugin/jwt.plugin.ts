import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "./env.plugin";

type TTokenData = {
    iat: number; // Timestamp de emisión
    exp: number; // Timestamp de expiración
    token: string; // El token JWT generado
}

const secretKey = env.JWT_SECRET;

export class JwtPlugin {
    /**
     * Genera un token JWT con una duración específica.
     * @param payload Información a firmar (ej. { userId: 1 }).
     * @param duration Tiempo de expiración (ej. '15m', '1h', '7d' o segundos).
     */
    static generateToken = async (
        payload: any,
        duration: SignOptions["expiresIn"] = "1h"
    ): Promise<TTokenData | null> => {
        return new Promise((resolve) => {
            jwt.sign(payload, secretKey, { expiresIn: duration }, async (err, token) => {
                if (err || !token) return resolve(null);

                // decodifica inmediatamente para extraer iat y exp
                const decoded = await JwtPlugin.verifyToken(token);
                if (!decoded || typeof decoded !== "object" || !("iat" in decoded) || !("exp" in decoded)) {
                    return resolve(null);
                }

                const { iat, exp } = decoded as { iat: number; exp: number };
                resolve({ token, iat, exp });
            });
        });
    };

    /**
     * Verifica un token JWT y retorna el payload si es válido.
     * @param token Token JWT a verificar.
     */
    static verifyToken = <T>(token: string): Promise<T | null> => {
        return new Promise((resolve) => {
            jwt.verify(token, secretKey, (err, decoded) => {
                if (err) return resolve(null);

                resolve(decoded as T);
            });
        });
    }
}