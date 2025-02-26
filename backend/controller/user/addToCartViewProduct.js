const addToCartModel = require("../../models/cartProduct");

const addToCartViewProduct = async(req, res) => {
    try {
        const currentUser = req.userId;
        const sessionId = req.sessionId || req.sessionID;

        // Buscar productos en el carrito del usuario actual o por sessionId
        const query = {
            $or: [
                { userId: currentUser },
                { sessionId: sessionId }
            ]
        };

        const allProduct = await addToCartModel.find(query).populate("productId");

        res.json({
            data: allProduct,
            success: true,
            error: false
        });

    } catch (err) {
        console.error('Error al ver productos en carrito:', err);
        res.json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = addToCartViewProduct;