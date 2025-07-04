import fs from 'fs';
import path from "path";

import { messages } from "../../../config";
import { ResponseEntity } from "../../../domain";

export class ClearTempService {
    async clearTmp(folder: string): Promise<ResponseEntity> {
        try {
            const pathTemp = `storage/app/temp/${folder}/`;
            console.log({ pathTemp })
            if (!fs.existsSync(pathTemp)) return ResponseEntity.create(messages.file.clear);

            const files = fs.readdirSync(pathTemp);

            for (const file of files) {
                const fullPath = path.join(pathTemp, file);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    this.clearTmp(fullPath); // Recursivamente limpiar subcarpeta
                    fs.rmdirSync(fullPath);
                } else {
                    fs.unlinkSync(fullPath); // Eliminar archivo
                }
            }

            return ResponseEntity.create(messages.file.clear)

        } catch (error) {
            console.log(error);

            if (error instanceof Error) {
                return ResponseEntity.create(messages.error.notFound({ message: error.message }));
            }
            return ResponseEntity.create(messages.error.serverError);
        }
    }

    async clearAllTmp(folder: string): Promise<ResponseEntity> {
        try {
            let pathTemp = `storage/app/temp/`;
            if (folder.length) {
                pathTemp = `storage/app/temp/${folder}/`;
            }
            const entries = await fs.promises.readdir(pathTemp);

            for (const entry of entries) {
                const fullPath = path.join(pathTemp, entry);
                const stat = await fs.promises.stat(fullPath);

                if (stat.isDirectory()) {
                    await this.clearAllTmp(path.join(folder, entry)); // Recursivo
                    await fs.promises.rmdir(fullPath);       // Elimina subdirectorio vacío
                } else {
                    await fs.promises.unlink(fullPath);      // Elimina archivo
                }
            }

            return ResponseEntity.create(messages.file.clear)
        } catch (error) {
            console.log(error);

            if (error instanceof Error) {
                return ResponseEntity.create(messages.error.notFound({ message: error.message }));
            }
            return ResponseEntity.create(messages.error.serverError);
        }
    }
}