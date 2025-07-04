import { messages, regularExpression } from "../../../config";
import { ResponseEntity } from "../../shared/entity/response.entity";

export class GetModuleDto {
    private constructor(
        public readonly id: number
    ) { }

    static create(id: number): ResponseEntity | GetModuleDto {
        let validateMessage: string[] = [];

        const idString = String(id).trim();
        const idNumber = Number(idString);

        if (!idString) {
            validateMessage.push('ID: Es requerido');
        } else if (!regularExpression.number.test(idString)) {
            validateMessage.push('ID: Debe ser un número entero positivo sin letras ni símbolos');
        } else if (isNaN(idNumber)) {
            validateMessage.push('ID: No es un número válido');
        } else if (idNumber <= 0) {
            validateMessage.push('ID: Debe ser mayor a cero');
        }

        if (validateMessage.length) return ResponseEntity.create(messages.validate.fields({ messages: validateMessage }));

        return new GetModuleDto(idNumber);
    }
}