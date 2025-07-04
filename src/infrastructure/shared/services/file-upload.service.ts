import fs from 'fs'
import path from 'path';

import { UploadedFile } from 'express-fileupload';

import { ResponseEntity } from '../../../domain';
import { messages } from '../../../config';

export class FileUploadService {
    private checkFolder(folderPath: string) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true })
        }
    }

    async uploadSingle(
        file: UploadedFile,
        folder: string,
        validExtensions: string[] = ['png', 'jpg', 'pneg', 'jpeg', 'gif']
    ): Promise<ResponseEntity> {
        try {
            const fileExtension = file.mimetype.split('/')[1] ?? '';
            const pathTemp = `storage/app/temp/${folder}/`;

            if (!validExtensions.includes(fileExtension)) {
                return ResponseEntity.create(messages.file.validate({
                    messages: `Extensión de archivo inválida, solo se permiten las siguientes extensiones ${validExtensions.join(',')}`
                }))
            }

            const destination = path.resolve(__dirname, '../../../../', pathTemp);
            this.checkFolder(destination);

            const fileName = file.name.replace(/\s+/g, "_");
            const fullPath = path.join(destination, fileName);

            if (fs.existsSync(fullPath)) {
                return ResponseEntity.create(messages.file.validate({
                    messages: `Ya existe un archivo con el nombre ${fileName} en el directorio`,
                    severity: 'error',
                    statusCode: 400
                }))
            }

            file.mv(`${destination}/${fileName}`)
            const data = {
                file: fileName
            }
            return ResponseEntity.create(messages.file.upload({ data }))
        } catch (error) {
            console.log(error);

            if (error instanceof Error) {
                return ResponseEntity.create(messages.error.notFound({ message: error.message }));
            }
            return ResponseEntity.create(messages.error.serverError);
        }

    }
}