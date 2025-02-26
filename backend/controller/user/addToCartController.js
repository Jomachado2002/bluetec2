const addToCartModel = require("../../models/cartProduct");

const addToCartController = async (req, res) => {
    try {
        const { productId } = req?.body;
        const currentUser = req.userId;
        const sessionId = req.sessionId || req.sessionID;
        const isGuest = !req.isAuthenticated;

        // Verificar si el producto ya existe en el carrito
        const query = {
            productId,
            $or: [
                { userId: currentUser },
                { sessionId: sessionId }
            ]
        };

        const isProductAvailable = await addToCartModel.findOne(query);

        if (isProductAvailable) {
            return res.json({
                message: "Producto ya existe en el carrito",
                success: false,
                error: true,
            });
        }

        // Crear nuevo producto en el carrito
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
            message: err?.message || err,
            error: true,
            success: false,
        });
    }
};

module.exports = addToCartController;