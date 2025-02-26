const addToCartModel = require("../../models/cartProduct");

const addToCartViewProduct = async(req, res) => {
    try {
        const currentUser = req.userId || 'guest';

        // Consulta para encontrar productos del usuario actual
        const allProduct = await addToCartModel.find({ userId: currentUser })
            .populate("productId")
            .lean();

        res.json({
            data: allProduct.filter(p => p.productId !== null),
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