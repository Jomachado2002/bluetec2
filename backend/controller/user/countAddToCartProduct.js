const addToCartModel = require("../../models/cartProduct");

const countAddToCartProduct = async (req, res) => {
    try {
        const currentUser = req.userId;
        const sessionId = req.sessionId || req.sessionID;

        // Contar productos en el carrito del usuario actual o por sessionId
        const query = {
            $or: [
                { userId: currentUser },
                { sessionId: sessionId }
            ]
        };

        const count = await addToCartModel.countDocuments(query);

        res.json({
            data: {
                count: count
            },
            message: "ok",
            error: false,
            success: true
        });
    } catch (error) {
        console.error('Error al contar productos en carrito:', error);
        res.json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

module.exports = countAddToCartProduct;