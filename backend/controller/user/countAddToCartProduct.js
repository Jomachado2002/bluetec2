const addToCartModel = require("../../models/cartProduct");

const countAddToCartProduct = async (req, res) => {
    try {
        const currentUser = req.userId || 'guest';
        const sessionId = req.sessionId || req.sessionID || 'session';

        // Consulta más permisiva para entornos serverless
        const query = {
            $or: [
                { userId: currentUser },
                { sessionId: sessionId },
                { isGuest: true }
            ]
        };

        // Usar lean() para optimizar rendimiento
        const items = await addToCartModel.find(query).lean();
        const count = items.length;

        // Responder con éxito incluso si count es 0
        res.json({
            data: {
                count: count
            },
            message: "ok",
            error: false,
            success: true
        });
    } catch (error) {
        console.error('Error al contar productos:', error);
        res.json({
            data: { count: 0 },
            message: "Error controlado",
            error: false,
            success: true,
        });
    }
};

module.exports = countAddToCartProduct;