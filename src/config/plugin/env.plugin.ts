import 'dotenv/config';
import { get } from 'env-var';

export const env = {
    PORT: get('PORT').required().asPortNumber(),
    JWT_SECRET: get('JWT_SECRET').required().asString(),
    TIME_ZONE: get('TIME_ZONE').required().asString(),
}