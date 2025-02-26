const addToCartModel = require("../../models/cartProduct");

const addToCartController = async (req, res) => {
    try {
        const { productId } = req?.body;
        if (!productId) {
            return res.json({
                message: "ID de producto requerido",
                success: false,
                error: true,
            });
        }

        const currentUser = req.userId;
        const sessionId = req.sessionId || req.sessionID;
        const isGuest = !req.isAuthenticated;

        console.log("Agregando al carrito:", {
            productId,
            userId: currentUser,
            sessionId: sessionId,
            isGuest
        });

        // Verificar si el producto ya existe en el carrito
        const query = {
            productId,
            $or: [
                { userId: currentUser },
                { sessionId: sessionId }
            ]
        };

        const isProductAvailable = await addToCartModel.findOne(query).lean();
        console.log("Producto existente:", isProductAvailable);

        if (isProductAvailable) {
            // Si el producto ya existe, simplemente notificamos
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
            isGuest,
            sessionId
        };

        console.log("Creando nuevo item en carrito:", payload);

        const newAddToCart = new addToCartModel(payload);
        const saveProduct = await newAddToCart.save();

        console.log("Producto guardado:", saveProduct._id);

        return res.json({
            data: saveProduct,
            message: "Producto agregado al carrito",
            success: true,
            error: false,
        });

    } catch (err) {
        console.error('Error al agregar al carrito:', {
            message: err.message,
            stack: err.stack,
            productId: req?.body?.productId,
            userId: req?.userId,
            sessionId: req?.sessionId || req?.sessionID
        });
        
        res.status(500).json({
            message: "Error al agregar al carrito: " + (err?.message || "Error desconocido"),
            error: true,
            success: false,
        });
    }
};

module.exports = addToCartController;