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

        // Asegurar que tenemos identificadores estables
        const currentUser = req.userId || 'guest';
        const sessionId = req.sessionId || req.sessionID || `session-${Date.now()}`;
        const isGuest = !req.isAuthenticated;

        // IMPORTANTE: Simplificar la lógica para Vercel
        // Siempre crear nuevo elemento - para entornos serverless
        const payload = {
            productId,
            quantity: 1,
            userId: currentUser,
            isGuest,
            sessionId
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