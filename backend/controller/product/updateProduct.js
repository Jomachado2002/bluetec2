const uploadProductPermission = require('../../helpers/permission')
const ProductModel = require ('../../models/productModel')

async function updateProductController (req, res){
    try{
        if(!uploadProductPermission(req.userId)){
            throw new Error ("Permiso Denegado")
        }

        
        const { _id, ...resBody} = req.body
        

        const updateProduct = await ProductModel.findByIdAndUpdate(_id, resBody)

        res.json({
            message: "Producto actualizado correctamente",
            data : updateProduct,
            success: true,
            error: false
        })
    
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}
module.exports = updateProductController