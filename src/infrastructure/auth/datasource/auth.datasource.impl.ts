import {
    AuthDatasource,
    AuthDto,
    LogoutDto,
    ResponseEntity
} from "../../../domain";
import { LoginService } from "../services/login.service";
import { LogoutService } from "../services/logout.service";

export class AuthDatasourceImpl implements AuthDatasource {
    private readonly loginService = new LoginService()
    private readonly logoutService = new LogoutService();

    async login(dto: AuthDto): Promise<ResponseEntity> {
        return this.loginService.login(dto);
    }

    async logout(dto: LogoutDto): Promise<ResponseEntity> {
        return this.logoutService.logout(dto);
    }
}