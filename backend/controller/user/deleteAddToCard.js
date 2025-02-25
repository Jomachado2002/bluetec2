const addToCartModel = require("../../models/cartProduct");

const deleteAddToCartProduct = async (req, res) => {
    try {
        // Si el usuario no está autenticado, usamos un identificador temporal
        const currentUser = req.userId || req.sessionID || "guest";
        const addToCartProductId = req.body._id;

        // Eliminamos el producto del carrito del usuario actual
        const deleteProduct = await addToCartModel.deleteOne({ _id: addToCartProductId, userId: currentUser });

        res.json({
            message: "Producto eliminado del carrito",
            error: false,
            success: true,
            data: deleteProduct
        });

    } catch (err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = deleteAddToCartProduct;