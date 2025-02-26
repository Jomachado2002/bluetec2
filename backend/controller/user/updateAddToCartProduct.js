const addToCartModel = require("../../models/cartProduct");

const updateAddToCartProduct = async(req, res) => {
    try{
        const currentUser = req.userId;
        const sessionId = req.sessionId || req.sessionID;
        const addToCartProductId = req?.body?._id;
        const qty = req.body.quantity;

        // Actualizar el producto verificando el usuario o sessionId
        const query = {
            _id: addToCartProductId,
            $or: [
                { userId: currentUser },
                { sessionId: sessionId }
            ]
        };

        const updateProduct = await addToCartModel.updateOne(query, {
            ...(qty && {quantity: qty})
        });

        res.json({
            message: "Producto Actualizado",
            data: updateProduct,
            error: false,
            success: true
        });

    } catch(err) {
        console.error('Error al actualizar producto en carrito:', err);
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = updateAddToCartProduct;