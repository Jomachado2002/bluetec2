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

        const currentUser = req.userId || 'guest';
        const sessionId = req.sessionId || req.sessionID || `session-${Date.now()}`;
        const isGuest = !req.isAuthenticated;

        const existingCartItem = await addToCartModel.findOne({
            productId,
            userId: currentUser
        });

        if (existingCartItem) {
            existingCartItem.quantity += 1;
            await existingCartItem.save();
            return res.json({
                data: existingCartItem,
                message: "Producto actualizado en el carrito",
                success: true,
                error: false,
            });
        }

        const payload = {
            productId,
            quantity: 1,
            userId: currentUser,
            sessionId,
            isGuest: true
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