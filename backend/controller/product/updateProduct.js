const uploadProductPermission = require('../../helpers/permission');
const ProductModel = require('../../models/productModel');

async function updateProductController(req, res) {
    try {
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Permiso denegado");
        }

        const { _id, ...resBody } = req.body;

        // Verificar si el producto existe
        const existingProduct = await ProductModel.findById(_id);
        if (!existingProduct) {
            throw new Error("El producto no existe o ya ha sido eliminado");
        }

        // Actualizar el producto y devolver el documento actualizado
        const updatedProduct = await ProductModel.findByIdAndUpdate(_id, resBody, { new: true });

        res.json({
            message: "Producto actualizado correctamente",
            data: updatedProduct,
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
}




module.exports = {
    updateProductController,
};
