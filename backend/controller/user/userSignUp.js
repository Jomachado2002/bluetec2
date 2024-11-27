const userModel = require('../../models/userModel');
const bcrypt = require('bcryptjs');

// Función para validar la fortaleza de la contraseña
function isPasswordSecure(password) {
    const minLength = 8; // Longitud mínima
    const hasUpperCase = /[A-Z]/.test(password); // Contiene al menos una mayúscula
    const hasLowerCase = /[a-z]/.test(password); // Contiene al menos una minúscula
    const hasNumbers = /[0-9]/.test(password); // Contiene al menos un número
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Contiene al menos un carácter especial

    return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChars
    );
}

async function userSignUpController(req, res) {
    try {
        const { email, password, name } = req.body;

        // Verificar si el usuario ya existe
        const user = await userModel.findOne({ email });

        console.log("usuario", user);

        if (user) {
            throw new Error("El usuario ya existe.");
        }

        // Validar que se proporcionen los campos requeridos
        if (!email) {
            throw new Error("Por favor, proporciona un correo electrónico.");
        }
        if (!password) {
            throw new Error("Por favor, proporciona una contraseña.");
        }
        if (!name) {
            throw new Error("Por favor, proporciona un nombre.");
        }

        // Validar la fortaleza de la contraseña
        if (!isPasswordSecure(password)) {
            throw new Error("La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial.");
        }

        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        if (!hashPassword) {
            throw new Error("Algo salió mal al encriptar la contraseña.");
        }

        // Crear el objeto del nuevo usuario
        const payload = {
            ...req.body,
            role: "GENERAL",
            password: hashPassword
        };

        // Guardar el nuevo usuario en la base de datos
        const userData = new userModel(payload);
        const saveUser = await userData.save();

        // Enviar respuesta de éxito
        res.status(201).json({
            data: saveUser,
            success: true,
            error: false,
            message: "¡Usuario creado con éxito!"
        });

    } catch (err) {
        // Manejo de errores
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = userSignUpController;
