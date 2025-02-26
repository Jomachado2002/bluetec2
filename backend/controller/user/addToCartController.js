const addToCartModel = require("../../models/cartProduct");

const addToCartController = async (req, res) => {
    try {
        const { productId } = req?.body;
        if (!productId) {
            return res.json({
                message: "ID de producto requerido",
                success: false,
                error: true,
            });
        }

        // Identificadores estables para usuarios
        const currentUser = req.userId || 'guest';
        const sessionId = req.sessionId || req.sessionID || `session-${Date.now()}`;
        const isGuest = !req.isAuthenticated;

        // Buscar si el producto ya existe para este usuario/sesión
        const existingCartItem = await addToCartModel.findOne({
            productId,
            $or: [
                { userId: currentUser },
                { sessionId: sessionId }
            ]
        });

        if (existingCartItem) {
            // Actualizar la fecha de creación para restablecer el TTL
            existingCartItem.createdAt = new Date();
            existingCartItem.quantity += 1;
            await existingCartItem.save();

            return res.json({
                data: existingCartItem,
                message: "Producto actualizado en el carrito",
                success: true,
                error: false,
            });
        }

        // Crear nuevo elemento de carrito
        const payload = {
            productId,
            quantity: 1,
            userId: currentUser,
            sessionId,
            isGuest,
            createdAt: new Date()
        };

        const newAddToCart = new addToCartModel(payload);
        const saveProduct = await newAddToCart.save();

        return res.json({
            data: saveProduct,
            message: "Producto agregado al carrito",
            success: true,
            error: false,
        });

    } catch (err) {
        console.error('Error al agregar al carrito:', err);
        res.json({
            message: err?.message || String(err),
            error: true,
            success: false,
        });
    }
};

module.exports = addToCartController;