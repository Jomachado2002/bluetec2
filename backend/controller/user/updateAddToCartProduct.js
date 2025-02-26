const addToCartModel = require("../../models/cartProduct");

const updateAddToCartProduct = async(req, res) => {
    try {
        const currentUser = req.userId;
        const sessionId = req.sessionId || req.sessionID;
        const addToCartProductId = req?.body?._id;
        const qty = req.body.quantity;

        console.log('Actualizando producto en carrito:', {
            productId: addToCartProductId,
            userId: currentUser,
            sessionId: sessionId,
            quantity: qty
        });

        const query = {
            _id: addToCartProductId,
            $or: [
                { userId: currentUser },
                { sessionId: sessionId }
            ]
        };

        const updateProduct = await addToCartModel.updateOne(query, {
            ...(qty && {quantity: qty}),
            createdAt: new Date() // Reiniciar el TTL al actualizar
        });

        if (updateProduct.modifiedCount === 0) {
            console.warn('No se actualizó ningún producto', {
                productId: addToCartProductId,
                userId: currentUser,
                sessionId: sessionId
            });
        }

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