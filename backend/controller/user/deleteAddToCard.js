const addToCartModel = require("../../models/cartProduct");

const deleteAddToCartProduct = async (req, res) => {
    try {
        const currentUser = req.userId;
        const sessionId = req.sessionId || req.sessionID;
        const addToCartProductId = req.body._id;

        // Eliminar el producto del carrito verificando el usuario o sessionId
        const query = {
            _id: addToCartProductId,
            $or: [
                { userId: currentUser },
                { sessionId: sessionId }
            ]
        };

        const deleteProduct = await addToCartModel.deleteOne(query);

        res.json({
            message: "Producto eliminado del carrito",
            error: false,
            success: true,
            data: deleteProduct
        });

    } catch (err) {
        console.error('Error al eliminar producto del carrito:', err);
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = deleteAddToCartProduct;