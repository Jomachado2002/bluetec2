const productModel = require("../../models/productModel");

const getCategoryProduct = async (req, res) => {
    try {
        // Obtener categorías únicas
        const uniqueCategories = await productModel.distinct("category");

        // Array para almacenar un producto por categoría
        const categoryProducts = [];

        // Para cada categoría, obtener solo el primer producto
        for (const category of uniqueCategories) {
            const product = await productModel.findOne({ category }).sort({ _id: 1 });
            if (product) {
                categoryProducts.push(product);
            }
        }

        res.json({
            message: "Categorías de productos",
            data: categoryProducts,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = getCategoryProduct;