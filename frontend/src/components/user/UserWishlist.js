// frontend/src/components/user/UserWishlist.js
import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  FaHeart, 
  FaShoppingCart, 
  FaTrash, 
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaRegHeart
} from 'react-icons/fa';
import displayPYGCurrency from '../../helpers/displayCurrency';
import addToCart from '../../helpers/addToCart';
import { toast } from 'react-toastify';
import Context from '../../context';
import { useContext } from 'react';

const UserWishlist = () => {
  const { userData, setUserData } = useOutletContext();
  const { fetchUserAddToCart } = useContext(Context);
  const [wishlist, setWishlist] = useState([]);
  const [filteredWishlist, setFilteredWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    const userWishlist = userData.wishlist || [];
    setWishlist(userWishlist);
    setFilteredWishlist(userWishlist);
  }, [userData]);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let filtered = [...wishlist];

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro por categoría
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.addedAt) - new Date(a.addedAt);
        case 'oldest':
          return new Date(a.addedAt) - new Date(b.addedAt);
        case 'priceHigh':
          return (b.price || 0) - (a.price || 0);
        case 'priceLow':
          return (a.price || 0) - (b.price || 0);
        case 'nameAZ':
          return a.productName.localeCompare(b.productName);
        case 'nameZA':
          return b.productName.localeCompare(a.productName);
        default:
          return 0;
      }
    });

    setFilteredWishlist(filtered);
  }, [wishlist, searchTerm, categoryFilter, sortBy]);

  // Obtener categorías únicas
  const getUniqueCategories = () => {
    const categories = wishlist.map(item => item.category).filter(Boolean);
    return [...new Set(categories)];
  };

  // Agregar producto al carrito
  const handleAddToCart = (product) => {
    // Crear objeto de producto compatible con addToCart
    const productForCart = {
      _id: product.productId,
      productName: product.productName,
      productImage: [product.image],
      sellingPrice: product.price,
      category: product.category,
      slug: product.slug
    };

    addToCart(null, productForCart);
    fetchUserAddToCart();
    toast.success(`${product.productName} agregado al carrito`);
  };

  // Eliminar de la lista de deseos
  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(item => item.productId !== productId);
    
    const updatedUserData = {
      ...userData,
      wishlist: updatedWishlist
    };
    
    setUserData(updatedUserData);
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    toast.success('Producto eliminado de tu lista de deseos');
  };

  // Limpiar toda la lista de deseos
  const clearWishlist = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los productos de tu lista de deseos?')) {
      const updatedUserData = {
        ...userData,
        wishlist: []
      };
      
      setUserData(updatedUserData);
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      toast.success('Lista de deseos limpiada');
    }
  };

  // Agregar todos al carrito
  const addAllToCart = () => {
    let addedCount = 0;
    filteredWishlist.forEach(item => {
      const productForCart = {
        _id: item.productId,
        productName: item.productName,
        productImage: [item.image],
        sellingPrice: item.price,
        category: item.category,
        slug: item.slug
      };
      
      addToCart(null, productForCart);
      addedCount++;
    });
    
    fetchUserAddToCart();
    toast.success(`${addedCount} productos agregados al carrito`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Mi Lista de Deseos</h1>
          <p className="text-gray-600">
            {filteredWishlist.length} producto{filteredWishlist.length !== 1 ? 's' : ''} guardado{filteredWishlist.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {wishlist.length > 0 && (
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              onClick={addAllToCart}
              className="flex items-center px-4 py-2 bg-[#002060] text-white rounded-lg hover:bg-[#003399] transition-colors text-sm"
            >
              <FaShoppingCart className="mr-2" />
              Agregar todo al carrito
            </button>
            <button
              onClick={clearWishlist}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <FaTrash className="mr-2" />
              Limpiar lista
            </button>
          </div>
        )}
      </div>

      {/* Filtros y controles */}
      {wishlist.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar en mis favoritos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
              />
            </div>

            {/* Filtro por categoría */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
            >
              <option value="all">Todas las categorías</option>
              {getUniqueCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Ordenamiento */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="priceHigh">Precio: Mayor a menor</option>
              <option value="priceLow">Precio: Menor a mayor</option>
              <option value="nameAZ">Nombre: A-Z</option>
              <option value="nameZA">Nombre: Z-A</option>
            </select>

            {/* Modo de vista */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 flex-1 ${viewMode === 'grid' ? 'bg-[#002060] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Cuadrícula
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 flex-1 ${viewMode === 'list' ? 'bg-[#002060] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Lista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      {filteredWishlist.length === 0 ? (
        <div className="text-center py-12">
          <FaRegHeart className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {wishlist.length === 0 ? 'Tu lista de deseos está vacía' : 'No se encontraron productos'}
          </h3>
          <p className="text-gray-500 mb-6">
            {wishlist.length === 0 
              ? 'Agrega productos que te gusten para encontrarlos fácilmente después'
              : 'Intenta ajustar los filtros para encontrar lo que buscas'
            }
          </p>
          <Link 
            to="/"
            className="inline-block bg-[#002060] text-white px-6 py-3 rounded-lg hover:bg-[#003399] transition-colors"
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
        }>
          {filteredWishlist.map((item) => (
            <div
              key={item.productId}
              className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                viewMode === 'list' ? 'flex items-center p-4' : ''
              }`}
            >
              {viewMode === 'grid' ? (
                // Vista de cuadrícula
                <>
                  <div className="relative">
                    <Link to={`/producto/${item.slug || item.productId}`}>
                      <div className="aspect-square bg-gray-100 overflow-hidden">
                        <img 
                          src={item.image || '/api/placeholder/300/300'} 
                          alt={item.productName}
                          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    
                    <button
                      onClick={() => removeFromWishlist(item.productId)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FaHeart className="text-sm" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <Link to={`/producto/${item.slug || item.productId}`}>
                      <h3 className="font-semibold text-gray-800 line-clamp-2 hover:text-[#002060] transition-colors mb-2">
                        {item.productName}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      <p className="text-lg font-bold text-[#002060]">
                        {displayPYGCurrency(item.price)}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full flex items-center justify-center gap-2 bg-[#002060] text-white py-2 rounded-lg hover:bg-[#003399] transition-colors text-sm"
                    >
                      <FaShoppingCart />
                      Agregar al carrito
                    </button>
                    
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Agregado el {new Date(item.addedAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </>
              ) : (
                // Vista de lista
                <>
                  <Link to={`/producto/${item.slug || item.productId}`} className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={item.image || '/api/placeholder/96/96'} 
                        alt={item.productName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </Link>
                  
                  <div className="flex-1 ml-4">
                    <Link to={`/producto/${item.slug || item.productId}`}>
                      <h3 className="font-semibold text-gray-800 hover:text-[#002060] transition-colors line-clamp-1">
                        {item.productName}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      <p className="text-lg font-bold text-[#002060]">
                        {displayPYGCurrency(item.price)}
                      </p>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">
                      Agregado el {new Date(item.addedAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center gap-2 bg-[#002060] text-white px-4 py-2 rounded-lg hover:bg-[#003399] transition-colors text-sm"
                    >
                      <FaShoppingCart />
                      Agregar
                    </button>
                    
                    <button
                      onClick={() => removeFromWishlist(item.productId)}
                      className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      <FaTrash />
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserWishlist;