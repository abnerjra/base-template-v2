import {
    AuthDatasource,
    AuthDto,
    AuthRepository,
    LogoutDto,
    ResponseEntity
} from "../../../domain";

export class AuthRepositoryImpl implements AuthRepository {
    constructor(private readonly datasource: AuthDatasource) { }

    login(dto: AuthDto): Promise<ResponseEntity> {
        return this.datasource.login(dto);
    }

    logout(dto: LogoutDto): Promise<ResponseEntity> {
        return this.datasource.logout(dto)
    }
}