const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    profilePic: String,
    role: String,
    resetPasswordToken: { // Campo para el token de restablecimiento
        type: String,
        default: null,
    },
    resetPasswordExpires: { // Fecha de expiración del token
        type: Date,
        default: null,
    }
}, {
    timestamps: true // Para incluir automáticamente createdAt y updatedAt
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
