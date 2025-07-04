export const messages = {
    response: {
        create: { message: "Registro creado correctamente", severity: "success", statusCode: 201 },
        update: { message: "Registro actualizado correctamente", severity: "success", statusCode: 200 },
        read: { message: "Información de registro", severity: "success", statusCode: 200 },
        reads: { message: "Información de registros", severity: "success", statusCode: 200 },
        delete: { message: "Registro eliminado correctamente", severity: "success", statusCode: 200 },
        empty: { message: "No hay registros", severity: "warning", statusCode: 404 }
    },
    fails: {
        register: { message: "Error al procesar la solicitud", severity: "error", statusCode: 400 },
        duplicate: { message: "El registro ya se encuentra en el sistema", severity: "warning", statusCode: 409 },
        notImplement: { message: 'Funcionalidad aún no implementada', severity: 'warning', statusCode: 400 }
    },
    auth: {
        invalidToken: { message: "Token inválido o expirado. Por favor, intente iniciar sesión nuevamente", severity: "error", statusCode: 401 },
        login: { message: "Inicio de sesión exitoso... bienvenido!!!", severity: "success", statusCode: 200 },
        logout: { message: "Cierre de sesión", severity: "success", statusCode: 200 },
        notFoundEmail: { message: "El correo proporcionado no se encuentra registrado en sistema", severity: "error", statusCode: 404 },
        notMatchPassword: { message: "La contraseña ingresada es incorrecta", severity: "error", statusCode: 401 },
        requiredToken: { message: "Es necesario proporcionar el token de acceso", severity: "error", statusCode: 401 },
        typeToken: { message: "El token de acceso debe ser de tipo Bearer", severity: "error", statusCode: 400 },
        sessionExpire: { message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente", severity: "error", statusCode: 401 },
    },
    validate: {
        existsEmail: { message: "El correo ingresado ya existe en el sistema", severity: "warning", statusCode: 422 },
        notExists: { message: "El registro no existe", severity: "warning", statusCode: 404 },
        fields: ({ messages }: { messages: string[] }) => ({
            message: `Validación de campos`,
            severity: "warning",
            data: messages,
            statusCode: 422
        }),
        emptyFields: { message: "Es necesario proporcionar la información para la creación del registro", severity: 'error', statusCode: 400 },
        personalized: ({ message, severity = 'warning', statusCode = 409, data = [] }: { message: string, severity?: string, statusCode?: number, data?: string[] }) => ({
            message,
            severity,
            statusCode,
            data
        })
    },
    permission: {
        withoutPermission: { message: "No tienes permisos para ver esta sección", severity: "warning", statusCode: 403 },
    },
    error: {
        notFound: ({ message }: { message: string }) => ({
            message,
            severity: "error",
            statusCode: 404
        }),
        serverError: { message: "Error interno del servidor", severity: "error", statusCode: 500 },
        databaseError: { message: "Error al conectar con la base de datos", severity: "error", statusCode: 500 },
        unknownError: { message: "Ocurrió un error desconocido", severity: "error", statusCode: 500 }
    },
    file: {
        validate: ({ messages, severity = 'warning', statusCode = 422 }: { messages: string, severity?: string, statusCode?: number }) => ({
            statusCode,
            severity,
            message: `Validación en carga de archivos`,
            data: messages
        }),
        upload: ({ data }: { data: object }) => ({ message: "Archivo cargado", severity: "success", statusCode: 200, data }),
        clear: { severity: 'success', message: 'Carpeta temporal vaciada', statusCode: 200, data: [] }
    }
}