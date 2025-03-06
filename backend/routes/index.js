const express = require('express');

const router = express.Router();

const userSignUpController = require("../controller/user/userSignUp");
const userSignInController = require('../controller/user/userSignin');
const userDetailsController = require('../controller/user/userDetails');
const authToken = require('../middleware/authToken');
const userLogout = require('../controller/user/userLogout');
const allUsers = require('../controller/user/allUser');
const updateUser = require('../controller/user/updateUser');
const UploadProductController = require('../controller/product/uploadProduct');
const getProductController = require('../controller/product/getProduct');
const { updateProductController} = require('../controller/product/updateProduct');
const getCategoryProduct = require('../controller/product/getCategoryProduct');
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct');
const getProductDetails = require('../controller/product/getProductDetails');
//const addToCartController = require('../controller/user/addToCartController');
//const countAddToCartProduct = require('../controller/user/countAddToCartProduct');
//const addToCartViewProduct = require('../controller/user/addToCartViewProduct');
//const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct');
//const deleteAddToCartProduct = require('../controller/user/deleteAddToCard');
const searchProduct = require('../controller/product/searchProduct');
const filterProductController = require('../controller/product/filterProduct');
const requestPasswordReset = require('../controller/user/requestPasswordReset');
const resetPassword = require('../controller/user/resetPassword');
const getCategorySearch = require('../controller/product/getCategorySearch');
const { deleteProductController } = require('../controller/product/deleteproductcontrolle');
const getProductBySlug = require('../controller/product/getProductBySlug');



// Archivo: backend/routes/index.js

// Rutas de usuario
router.post("/registro", userSignUpController); // Antes: signup
router.post("/iniciar-sesion", userSignInController); // Antes: signin
router.get("/detalles-usuario", authToken, userDetailsController); // Antes: user-details
router.get("/cerrar-sesion", userLogout); // Antes: userLogout

// Admin panel
router.get("/todos-usuarios", authToken, allUsers); // Antes: all-user
router.post("/actualizar-usuario", authToken, updateUser); // Antes: update-user

// Productos
router.post("/cargar-producto", authToken, UploadProductController); // Antes: upload-product
router.get("/obtener-productos", getProductController); // Antes: get-product
router.post("/actualizar-producto", authToken, updateProductController); // Antes: update-product
router.get("/obtener-categorias", getCategoryProduct); // Antes: get-categoryProduct
router.post("/productos-por-categoria", getCategoryWiseProduct); // Antes: category-product
router.post("/detalles-producto", getProductDetails); // Antes: product-details
router.get("/buscar", searchProduct); // Antes: search
router.post("/filtrar-productos", filterProductController); // Antes: filter-product

// Carrito de compras (si decides reactivarlos)
//router.post("/agregar-al-carrito", authToken, addToCartController); // Antes: addtocart
//router.get("/contar-productos-carrito", authToken, countAddToCartProduct); // Antes: countAddToCartProduct
//router.get("/ver-productos-carrito", authToken, addToCartViewProduct); // Antes: view-card-product
//router.post("/actualizar-producto-carrito", authToken, updateAddToCartProduct); // Antes: update-cart-product
//router.post("/eliminar-producto-carrito", authToken, deleteAddToCartProduct); // Antes: delete-cart-product

// Recuperación de contraseña
router.post("/solicitar-restablecer-contrasena", requestPasswordReset); // Antes: request-password-reset
router.post("/restablecer-contrasena", resetPassword); // Antes: reset-password

// Búsqueda de productos
router.get("/buscar-por-categoria", getCategorySearch); // Antes: getsearchProduct

// Eliminar producto
router.post("/eliminar-producto", authToken, deleteProductController); // Antes: delete-product

router.get("/producto-por-slug/:slug", getProductBySlug);





module.exports = router;
