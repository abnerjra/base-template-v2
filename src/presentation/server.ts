import express, { Router } from 'express';
import fileUpload from 'express-fileupload';

interface Options {
    port: number
}

export class Server {
    public readonly app = express();
    private serverListener: any;
    private readonly port: number;

    constructor(options: Options) {
        this.port = options.port;

        this.configure();

    }

    private configure = () => {
        //* Middleware
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 }
        }));

        //* Public folder


        //* SPA /^\/(?!api).*/  <== Únicamente si no empieza con la palabra api
        this.app.get(/^\/(?!api).*/, (req, res) => {
            res.status(200).json({ message: "Welcome to the API!" });
        });
    }

    //* Routes
    public setRoutes = (router: Router) => {
        this.app.use(router)
    }

    public start = async () => {
        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

    public close = () => {
        this.serverListener?.close();
    }
}