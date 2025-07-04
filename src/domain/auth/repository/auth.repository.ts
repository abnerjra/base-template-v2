import { ResponseEntity } from "../../shared/entity/response.entity";
import { AuthDto } from "../dtos/auth.dto";
import { LogoutDto } from "../dtos/logout.dto";

export abstract class AuthRepository {
    abstract login(dto: AuthDto): Promise<ResponseEntity>

    abstract logout(token: LogoutDto): Promise<ResponseEntity>;
}