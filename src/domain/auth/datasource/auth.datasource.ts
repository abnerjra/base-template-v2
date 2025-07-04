import { ResponseEntity } from "../../shared/entity/response.entity";
import { AuthDto } from "../dtos/auth.dto";
import { LogoutDto } from "../dtos/logout.dto";

export abstract class AuthDatasource {
    abstract login(dto: AuthDto): Promise<ResponseEntity>;

    abstract logout(dto: LogoutDto): Promise<ResponseEntity>;
}