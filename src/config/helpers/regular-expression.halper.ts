export const regularExpression = {
    // email
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    // without spaces
    withoutSpaces: /^[^\s]+$/,
    // password
    password: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?])\S{8,}$/,
    // number
    number: /^\d+$/,
}