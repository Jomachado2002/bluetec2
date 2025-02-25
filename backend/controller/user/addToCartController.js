const addToCartModel = require("../../models/cartProduct");

const addToCartController = async (req, res) => {
    try {
        const { productId } = req?.body;
        const currentUser = req.userId;
        const isGuest = !req.cookies?.token;

        // Verificar si el producto ya existe en el carrito
        const isProductAvailable = await addToCartModel.findOne({
            productId,
            userId: currentUser
        });

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
            isGuest
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
        res.json({
            message: err?.message || err,
            error: true,
            success: false,
        });
    }
};

module.exports = addToCartController;