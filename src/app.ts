import { env } from "./config";
import { AppRoutes } from "./presentation/routes";
import { Server } from './presentation/server';

(() => {
    main();
})()

function main() {
    const PORT = env.PORT;
    
    const server = new Server({
        port: PORT
    });

    server.setRoutes(AppRoutes.routes)

    server.start();
}