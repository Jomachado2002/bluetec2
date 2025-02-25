const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel');
const addToCartModel = require('../../models/cartProduct'); // Agregar esta línea
const jwt = require('jsonwebtoken');

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Por favor ingresa tu correo y contraseña.",
                error: true,
                success: false
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado.",
                error: true,
                success: false
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Contraseña incorrecta.",
                error: true,
                success: false
            });
        }

        const tokenData = {
            _id: user._id,
            email: user.email,
            role: user.role,
            name: user.name
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '24h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        });

        try {
            if (req.session.guestId) {
                await transferGuestCart(req.session.guestId, user._id);
            }
        } catch (error) {
            console.error('Error al transferir carrito:', error);
            // No interrumpimos el login si falla la transferencia del carrito
        }

        return res.status(200).json({
            message: "Inicio de sesión exitoso",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            success: true,
            error: false
        });

    } catch (err) {
        console.error('Error en signin:', err);
        return res.status(500).json({
            message: "Error en el servidor",
            error: true,
            success: false
        });
    }
}

// Función para transferir el carrito de invitado
async function transferGuestCart(guestId, userId) {
    try {
        const guestCart = await addToCartModel.find({ userId: guestId });
        
        for (const item of guestCart) {
            await addToCartModel.findOneAndUpdate(
                { 
                    productId: item.productId,
                    userId: userId 
                },
                {
                    $set: {
                        quantity: item.quantity,
                        userId: userId,
                        isGuest: false
                    }
                },
                { upsert: true }
            );
        }
        
        // Eliminar carrito de invitado
        await addToCartModel.deleteMany({ userId: guestId });
    } catch (error) {
        console.error('Error al transferir carrito:', error);
        throw error;
    }
}

module.exports = userSignInController;