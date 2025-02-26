const addToCartModel = require("../../models/cartProduct");

const deleteAddToCartProduct = async (req, res) => {
    try {
        const currentUser = req.userId || 'guest';
        const sessionId = req.sessionId || req.sessionID || 'session';
        const addToCartProductId = req.body._id;

        // Eliminar el producto del carrito verificando el usuario o sessionId
        const deleteProduct = await addToCartModel.deleteOne({
            _id: addToCartProductId,
            $or: [
                { userId: currentUser },
                { sessionId: sessionId }
            ]
        });

        // Verificar si se eliminó algún producto
        if (deleteProduct.deletedCount === 0) {
            return res.json({
                message: "Producto no encontrado o no autorizado",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Producto eliminado del carrito",
            error: false,
            success: true,
            data: deleteProduct
        });

    } catch (err) {
        console.error('Error al eliminar producto del carrito:', err);
        res.json({
            message: err?.message || "Error al eliminar producto",
            error: true,
            success: false
        });
    }
};

module.exports = deleteAddToCartProduct;