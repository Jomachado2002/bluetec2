const addToCartModel = require("../../models/cartProduct");

const addToCartViewProduct = async(req, res) => {
    try {
        const currentUser = req.userId; // Guest ID from authToken
        const sessionId = req.sessionId || req.sessionID;

        // Find cart items for the current user or session
        const allProduct = await addToCartModel.find({
            $or: [
                { userId: currentUser },
                { sessionId: sessionId }
            ]
        })
        .populate("productId")
        .lean();

        res.json({
            data: allProduct.filter(p => p.productId !== null),
            success: true,
            error: false
        });

    } catch (err) {
        console.error('Error viewing cart products:', err);
        res.json({
            data: [],
            message: "Controlled error",
            error: false,
            success: true
        });
    }
};

module.exports = addToCartViewProduct;