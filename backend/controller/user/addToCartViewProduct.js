const addToCartModel = require("../../models/cartProduct");

const addToCartViewProduct = async(req, res) => {
    try {
        const currentUser = req.userId || 'guest';
        const sessionId = req.sessionId || req.sessionID || 'session';

        // Consulta más amplia para entornos serverless
        const query = {
            $or: [
                { userId: currentUser },
                { sessionId: sessionId },
                { isGuest: true }
            ]
        };

        // Optimizar con lean()
        const allProduct = await addToCartModel.find(query)
            .populate("productId")
            .lean();

        res.json({
            data: allProduct.filter(p => p.productId !== null), // Filtrar productos no válidos
            success: true,
            error: false
        });

    } catch (err) {
        console.error('Error al ver productos en carrito:', err);
        res.json({
            data: [],
            message: "Error controlado",
            error: false,
            success: true
        });
    }
};

module.exports = addToCartViewProduct;