const userModel = require("../../models/userModel")

async function userDetailsController(req,res){
    try{
        console.log("userId",req.userId)
        const user = await userModel.findById(req.userId)

        res.status(200).json({
            data : user,
            error : false,
            success : true,
            message : "Detalles del usuario"
        })

        console.log("user",user)

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = userDetailsController

const addToCartModel = require("../../models/cartProduct");

const addToCartController = async (req, res) => {
    try {
        const { productId } = req?.body; // Obtenemos el ID del producto desde el cuerpo de la petición
        const currentUser = req.userId; // Obtenemos el ID del usuario actual

        // Verificamos si el producto ya existe en el carrito del usuario actual
        const isProductAvailable = await addToCartModel.findOne({ productId, userId: currentUser });

        console.log("isProductAvailable:", isProductAvailable);

        if (isProductAvailable) {
            return res.json({
                message: "Producto ya existe en el carrito",
                success: false,
                error: true,
            });
        }

        // Creación de un nuevo producto en el carrito del usuario
        const payload = {
            productId: productId,
            quantity: 1,
            userId: currentUser,
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
