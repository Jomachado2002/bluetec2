// backend/controller/product/updateProductFinance.js
const ProductModel = require('../../models/productModel');
const uploadProductPermission = require('../../helpers/permission');

/**
 * Actualiza la información financiera de un producto y calcula el margen de ganancia
 */
async function updateProductFinanceController(req, res) {
    try {
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Permiso denegado");
        }

        const { 
            productId, 
            purchasePrice, 
            loanInterest, 
            deliveryCost, 
            sellingPrice 
        } = req.body;

        if (!productId) {
            throw new Error("ID de producto no proporcionado");
        }

        // Verificamos que el producto existe
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new Error("Producto no encontrado");
        }

        // Convertimos a números y validamos
        const purchase = Number(purchasePrice) || 0;
        const interest = Number(loanInterest) || 0;
        const delivery = Number(deliveryCost) || 0;
        const selling = Number(sellingPrice) || 0;

        if (purchase <= 0) {
            throw new Error("El precio de compra debe ser mayor que cero");
        }

        if (selling <= 0) {
            throw new Error("El precio de venta debe ser mayor que cero");
        }

        // Calculamos los costos totales
        const totalCosts = purchase + (purchase * (interest / 100)) + delivery;
        
        // Calculamos la utilidad y el margen de ganancia
        const profitAmount = selling - totalCosts;
        const profitMargin = (profitAmount / selling) * 100;

        // Actualizamos el producto
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            {
                sellingPrice: selling,
                purchasePrice: purchase,
                loanInterest: interest,
                deliveryCost: delivery,
                profitAmount: profitAmount,
                profitMargin: profitMargin,
                lastUpdatedFinance: new Date()
            },
            { new: true }
        );

        res.json({
            message: "Información financiera actualizada correctamente",
            data: {
                product: updatedProduct,
                financialSummary: {
                    sellingPrice: selling,
                    purchasePrice: purchase,
                    interestAmount: purchase * (interest / 100),
                    deliveryCost: delivery,
                    totalCosts: totalCosts,
                    profitAmount: profitAmount,
                    profitMargin: profitMargin.toFixed(2)
                }
            },
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

/**
 * Obtiene un resumen financiero de un producto
 */
async function getProductFinanceController(req, res) {
    try {
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Permiso denegado");
        }

        const { productId } = req.params;

        if (!productId) {
            throw new Error("ID de producto no proporcionado");
        }

        const product = await ProductModel.findById(productId);
        
        if (!product) {
            throw new Error("Producto no encontrado");
        }

        // Calculamos los valores financieros
        const purchase = product.purchasePrice || 0;
        const interest = product.loanInterest || 0;
        const delivery = product.deliveryCost || 0;
        const selling = product.sellingPrice || 0;

        const interestAmount = purchase * (interest / 100);
        const totalCosts = purchase + interestAmount + delivery;
        const profitAmount = selling - totalCosts;
        const profitMargin = selling > 0 ? (profitAmount / selling) * 100 : 0;

        res.json({
            message: "Información financiera del producto",
            data: {
                product: {
                    _id: product._id,
                    productName: product.productName,
                    sellingPrice: selling,
                    purchasePrice: purchase,
                    loanInterest: interest,
                    deliveryCost: delivery,
                    lastUpdatedFinance: product.lastUpdatedFinance
                },
                financialSummary: {
                    sellingPrice: selling,
                    purchasePrice: purchase,
                    interestAmount: interestAmount,
                    deliveryCost: delivery,
                    totalCosts: totalCosts,
                    profitAmount: profitAmount,
                    profitMargin: profitMargin.toFixed(2)
                }
            },
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
    updateProductFinanceController,
    getProductFinanceController
};