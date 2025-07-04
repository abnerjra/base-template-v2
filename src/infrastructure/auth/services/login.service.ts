import { BcryptPlugin, JwtPlugin, messages } from "../../../config";
import { AuthDto, AuthEntity, ResponseEntity } from "../../../domain";
import { AuthTokenModel } from "../../models/authToken.model";
import { RoleModel } from "../../models/role.model";
import { UserModel } from "../../models/user.model";

export class LoginService {
    private userModel = new UserModel();
    private authTokenModel = new AuthTokenModel();
    private roleModel = new RoleModel();

    async login(dto: AuthDto): Promise<ResponseEntity> {
        try {
            const { email, password } = dto;

            const queryOptions = {
                where: { email }
            }

            const user = await this.userModel.findOne(queryOptions);

            if (!user) return ResponseEntity.create(messages.auth.notFoundEmail);
            if (!user.active) return ResponseEntity.create(messages.error.notFound({ message: "El usuario no se encuentra activo" }));

            const isValidPassword = BcryptPlugin.compare({ password, hash: user.password });
            if (!isValidPassword) return ResponseEntity.create(messages.auth.notMatchPassword);

            const activeToken = await this.authTokenModel.findOne({ where: { userId: user.id, revoked: false } });
            const { token, iat, exp } = await this.handleToken(activeToken?.token, { id: user.id, email: user.email });

            const hasRoles = await this.userModel.hasRole(user.id);

            const permissionsMap: Record<string, { description: string; action: string }[]> = {};

            for (const role of hasRoles) {
                const rolePermissions = await this.roleModel.hasPermission(role.id);

                for (const [module, actions] of Object.entries(rolePermissions)) {
                    if (!permissionsMap[module]) {
                        permissionsMap[module] = [];
                    }

                    for (const action of actions) {
                        const exists = permissionsMap[module].some(
                            (perm) => perm.action === action.action && perm.description === action.description
                        );
                        if (!exists) {
                            permissionsMap[module].push(action);
                        }
                    }
                }
            }

            const loginData = AuthEntity.fromJson({ ...user, token, iat, exp, roles: hasRoles, permissions: permissionsMap });
            return ResponseEntity.create({ ...messages.auth.login, data: loginData });
        } catch (error) {
            console.log(error);

            if (error instanceof Error) {
                return ResponseEntity.create(messages.error.notFound({ message: error.message }));
            }
            return ResponseEntity.create(messages.error.serverError);
        }
    }

    private handleToken = async (token: string, payload: { id: number, email: string }): Promise<{ token: string, iat: number, exp: number }> => {
        const activeToken = await JwtPlugin.verifyToken(token);
        let iat: number;
        let exp: number;
        if (!activeToken) {
            if (token) {
                const oldToken = token;
                await this.authTokenModel.update({ data: { revoked: true }, where: { token: oldToken } })
            }
            const newToken = await JwtPlugin.generateToken(payload);
            token = newToken!.token;
            iat = newToken!.iat;
            exp = newToken!.exp;

            const saveToken = {
                token: token,
                userId: payload.id,
                createdAt: iat,
                expiresAt: exp
            }

            await this.authTokenModel.create(saveToken)
        } else {
            const { iat: createdAt, exp: expiresAt } = activeToken as { iat: number; exp: number };
            iat = createdAt;
            exp = expiresAt;
        }
        return { token, iat, exp };
    }
}