const backendDomain = process.env.REACT_APP_BACKEND_URL;

const SummaryApi = {
    // Autenticación
    SignUP: { 
        url: `${backendDomain}/api/registro`,  // Cambiar "signup" a "registro"
        method: "post"
    },
    signIn: {
        url: `${backendDomain}/api/iniciar-sesion`,  // Cambiar "signin" a "iniciar-sesion"
        method: "post"
    },
    current_user : {
        url: `${backendDomain}/api/detalles-usuario`,  // Cambiar "user-details" a "detalles-usuario"
        method: "get"
    },
    logout_user: {
        url: `${backendDomain}/api/cerrar-sesion`,  // Cambiar "userLogout" a "cerrar-sesion"
        method : "get"
    },
    allUser:{
        url: `${backendDomain}/api/todos-usuarios`,  // Cambiar "all-user" a "todos-usuarios"
        method : "get" 
    },
    updateUser: {
        url: `${backendDomain}/api/actualizar-usuario`,  // Cambiar "update-user" a "actualizar-usuario"
        method : "post"
    },
    uploadProduct: {
        url : `${backendDomain}/api/cargar-producto`,  // Cambiar "upload-product" a "cargar-producto"
        method : 'post'
    },
    allProduct: {
        url: `${backendDomain}/api/obtener-productos`,  // Cambiar "get-product" a "obtener-productos"
        method : 'get'
    },
    updateProduct : {
        url : `${backendDomain}/api/actualizar-producto`,  // Cambiar "update-product" a "actualizar-producto"
        method : 'post'
    },
    categoryProduct : {
        url: `${backendDomain}/api/obtener-categorias`,  // Cambiar "get-categoryProduct" a "obtener-categorias"
        method: 'get'
    },
    categoryWiseProduct : {
        url : `${backendDomain}/api/productos-por-categoria`,  // Cambiar "category-product" a "productos-por-categoria"
        method : 'post'
    },
    productDetails : {
        url : `${backendDomain}/api/detalles-producto`,  // Cambiar "product-details" a "detalles-producto"
        method : 'post'
    },
    addToCartProduct : {
        url : `${backendDomain}/api/agregar-al-carrito`,  // Cambiar "addtocart" a "agregar-al-carrito"
        method : 'post'
    },
    addToCartProductCount : {
        url : `${backendDomain}/api/contar-productos-carrito`,  // Cambiar "countAddToCartProduct" a "contar-productos-carrito"
        method : 'get'
    },
    addToCartProductView : {
        url : `${backendDomain}/api/ver-productos-carrito`,  // Cambiar "view-card-product" a "ver-productos-carrito"
        method : 'get'
    },
    updateCartProduct : {
        url : `${backendDomain}/api/actualizar-producto-carrito`,  // Cambiar "update-cart-product" a "actualizar-producto-carrito"
        method : 'post'
    },
    deleteCartProduct : {
        url : `${backendDomain}/api/eliminar-producto-carrito`,  // Cambiar "delete-cart-product" a "eliminar-producto-carrito"
        method : 'post'
    },
    searchProduct : {
        url : `${backendDomain}/api/buscar`,  // Mantenido como "search" -> "buscar" (corto y claro)
        method : 'get'
    },
    filterProduct : {
        url : `${backendDomain}/api/filtrar-productos`,  // Cambiar "filter-product" a "filtrar-productos"
        method : 'post'
    },
    forgotPassword: {
        url: `${backendDomain}/api/solicitar-restablecer-contrasena`,  // Cambiar "request-password-reset" a "solicitar-restablecer-contrasena"
        method: 'post'
    },
    resetPassword: {
        url: `${backendDomain}/api/restablecer-contrasena`,  // Cambiar "reset-password" a "restablecer-contrasena"
        method: 'post'
    },
    getCategorySearch: {
        url: `${backendDomain}/api/buscar-por-categoria`,  // Cambiar "get-categorySearch" a "buscar-por-categoria"
        method: "GET"
    },
    deleteProductController: {
        url: `${backendDomain}/api/eliminar-producto`,  // Cambiar "delete-product" a "eliminar-producto"
        method: 'post'
    }
};

export default SummaryApi;