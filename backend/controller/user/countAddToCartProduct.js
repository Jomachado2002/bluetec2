const addToCartModel = require("../../models/cartProduct");

const countAddToCartProduct = async (req, res) => {
    try {
        // Si el usuario no está autenticado, usamos un identificador temporal
        const currentUser = req.userId || req.sessionID || "guest";

        // Contamos los productos en el carrito del usuario actual
        const count = await addToCartModel.countDocuments({
            userId: currentUser
        });

        res.json({
            data: {
                count: count
            },
            message: "ok",
            error: false,
            success: true
        });
    } catch (error) {
        res.json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

module.exports = countAddToCartProduct;