const backendDomain = "http://localhost:8080"; // Cambiado "backendDomin" a "backendDomain"

const SummaryApi = {
    SignUP: { 
        url: `${backendDomain}/api/signup`,
        method: "post"
    },
    signIn: {  // Correcto: "signIn" con 'g'
        url: `${backendDomain}/api/signin`,
        method: "post"  // Cambiado "metho" a "method"
    },
    current_user : {
        url: `${backendDomain}/api/user-details`,
        method: "get"
    },
    logout_user: {
        url: `${backendDomain}/api/userLogout`,
        method : "get"
    },
    allUser:{
        url: `${backendDomain}/api/all-user`,
        method : "get" 
    },
    updateUser: {
        url: `${backendDomain}/api/update-user`,
        method : "post"
    },
    uploadProduct: {
        url : `${backendDomain}/api/upload-product`,
        method : 'post'
    },
    allProduct: {
        url: `${backendDomain}/api/get-product`,  // <--- Corrección aquí
        method : 'get'
    },
    updateProduct : {
        url : `${backendDomain}/api/update-product`,
        method : 'post'
    },
    categoryProduct : {
        url: `${backendDomain}/api/get-categoryProduct`,
        method: 'get'
    },
    categoryWiseProduct : {
        url : `${backendDomain}/api/category-product`,
        method : 'post'
    },
    productDetails : {
        url : `${backendDomain}/api/product-details`,
        method : 'post'
    },
    addToCartProduct : {
        url : `${backendDomain}/api/addtocart`,
        method : 'post'
    },
    addToCartProductCount : {
        url : `${backendDomain}/api/countAddToCartProduct`,
        method : 'get'
    },
    addToCartProductView : {
        url : `${backendDomain}/api/view-card-product`,
        method : 'get'
    },
    updateCartProduct : {
        url : `${backendDomain}/api/update-cart-product`,
        method : 'post'
    },
    deleteCartProduct : {
        url : `${backendDomain}/api/delete-cart-product`,
        method : 'post'
    },
    searchProduct : {
        url : `${backendDomain}/api/search`,
        method : 'get'
    },
    filterProduct : {
        url : `${backendDomain}/api/filter-product`,
        method : 'post'
    },
    // Añadido para el reseteo de contraseñas
    forgotPassword: {
        url: `${backendDomain}/api/request-password-reset`, // Cambiar la ruta para coincidir con el backend
        method: 'post'
    },
    resetPassword: {
        url: `${backendDomain}/api/reset-password`, // Resetear la contraseña con el token
        method: 'post'
    },
    getCategorySearch: {
        url: `${backendDomain}/api/get-categorySearch`,  // Agregando el dominio del backend
        method: "GET"
    },
    deleteProductController: {
        url: `${backendDomain}/api/delete-product`, 
        method: 'post'
    }


};

export default SummaryApi;
