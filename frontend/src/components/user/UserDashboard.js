// frontend/src/components/user/UserDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaShoppingBag, 
  FaHeart, 
  FaTruck, 
  FaClock, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaWhatsapp,
  FaArrowRight
} from 'react-icons/fa';
import displayPYGCurrency from '../../helpers/displayCurrency';

const UserDashboard = () => {
  const user = useSelector(state => state?.user?.user);
  const { userData } = useOutletContext();
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentWishlist, setRecentWishlist] = useState([]);

  useEffect(() => {
    // Cargar pedidos recientes (últimos 3)
    const orders = userData.orders || [];
    setRecentOrders(orders.slice(0, 3));

    // Cargar wishlist reciente (últimos 4)
    const wishlist = userData.wishlist || [];
    setRecentWishlist(wishlist.slice(0, 4));
  }, [userData]);

  // Obtener estadísticas del usuario
  const getStats = () => {
    const orders = userData.orders || [];
    const wishlist = userData.wishlist || [];
    
    const totalSpent = orders.reduce((sum, order) => sum + (order.totals?.total || 0), 0);
    const pendingOrders = orders.filter(order => 
      order.status === 'paid' || order.status === 'shipped'
    ).length;
    
    return {
      totalOrders: orders.length,
      pendingOrders,
      wishlistItems: wishlist.length,
      totalSpent
    };
  };

  const stats = getStats();

  // Función para obtener el estado del pedido con colores
  const getOrderStatusInfo = (status) => {
    const statusMap = {
      'pending_payment': { 
        label: 'Esperando pago', 
        color: 'bg-yellow-100 text-yellow-800',
        icon: <FaClock className="w-4 h-4" />
      },
      'paid': { 
        label: 'Pagado - Preparando', 
        color: 'bg-blue-100 text-blue-800',
        icon: <FaShoppingBag className="w-4 h-4" />
      },
      'shipped': { 
        label: 'Enviado', 
        color: 'bg-purple-100 text-purple-800',
        icon: <FaTruck className="w-4 h-4" />
      },
      'delivered': { 
        label: 'Entregado', 
        color: 'bg-green-100 text-green-800',
        icon: <FaCheckCircle className="w-4 h-4" />
      },
      'cancelled': { 
        label: 'Cancelado', 
        color: 'bg-red-100 text-red-800',
        icon: <FaExclamationTriangle className="w-4 h-4" />
      }
    };
    
    return statusMap[status] || statusMap['paid'];
  };

  // Función para abrir WhatsApp con información del pedido
  const contactSupport = (order = null) => {
    let message = "Hola BlueTec, necesito ayuda con mi cuenta.";
    
    if (order) {
      message = `Hola BlueTec, necesito información sobre mi pedido ${order.id}. Estado actual: ${getOrderStatusInfo(order.status).label}`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/595984133733?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="p-6">
      {/* Bienvenida */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          ¡Hola {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600">
          Aquí tienes un resumen de tu actividad reciente en BlueTec
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total de Pedidos</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <FaShoppingBag className="text-2xl text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">En Proceso</p>
              <p className="text-2xl font-bold">{stats.pendingOrders}</p>
            </div>
            <FaTruck className="text-2xl text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Lista de Deseos</p>
              <p className="text-2xl font-bold">{stats.wishlistItems}</p>
            </div>
            <FaHeart className="text-2xl text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Gastado</p>
              <p className="text-lg font-bold">
                {displayPYGCurrency(stats.totalSpent)}
              </p>
            </div>
            <div className="text-2xl text-purple-200">💰</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pedidos Recientes */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Pedidos Recientes</h2>
            <Link 
              to="pedidos" 
              className="text-[#002060] hover:text-[#003399] text-sm font-medium flex items-center"
            >
              Ver todos <FaArrowRight className="ml-1 w-3 h-3" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <FaShoppingBag className="mx-auto text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Aún no has realizado ningún pedido</p>
              <Link 
                to="/" 
                className="inline-block bg-[#002060] text-white px-6 py-2 rounded-lg hover:bg-[#003399] transition-colors"
              >
                Explorar productos
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const statusInfo = getOrderStatusInfo(order.status);
                return (
                  <div key={order.id} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-800">Pedido #{order.id}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span className="ml-1">{statusInfo.label}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          {order.products?.length} producto(s)
                        </p>
                        <p className="font-semibold text-[#002060]">
                          {displayPYGCurrency(order.totals?.total || 0)}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link
                          to={`pedidos/${order.id}`}
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                        >
                          Ver detalles
                        </Link>
                        {(order.status === 'paid' || order.status === 'shipped') && (
                          <button
                            onClick={() => contactSupport(order)}
                            className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition-colors flex items-center"
                          >
                            <FaWhatsapp className="w-3 h-3 mr-1" />
                            Seguimiento
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Lista de Deseos Reciente */}
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Lista de Deseos</h2>
            <Link 
              to="wishlist" 
              className="text-[#002060] hover:text-[#003399] text-sm font-medium flex items-center"
            >
              Ver todos <FaArrowRight className="ml-1 w-3 h-3" />
            </Link>
          </div>

          {recentWishlist.length === 0 ? (
            <div className="text-center py-8">
              <FaHeart className="mx-auto text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Tu lista de deseos está vacía</p>
              <Link 
                to="/" 
                className="inline-block bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Agregar productos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {recentWishlist.map((item) => (
                <Link
                  key={item.productId}
                  to={`/producto/${item.slug || item.productId}`}
                  className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.productName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">
                    {item.productName}
                  </p>
                  <p className="text-sm font-semibold text-[#002060] mt-1">
                    {displayPYGCurrency(item.price)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="mt-8 bg-[#002060] rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">¿Necesitas ayuda?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => contactSupport()}
            className="bg-white bg-opacity-20 p-4 rounded-lg hover:bg-opacity-30 transition-colors text-left"
          >
            <FaWhatsapp className="text-2xl mb-2" />
            <p className="font-medium">Contactar Soporte</p>
            <p className="text-sm text-blue-100">Chatea con nosotros</p>
          </button>
          
          <Link
            to="pedidos"
            className="bg-white bg-opacity-20 p-4 rounded-lg hover:bg-opacity-30 transition-colors text-left block"
          >
            <FaTruck className="text-2xl mb-2" />
            <p className="font-medium">Rastrear Pedido</p>
            <p className="text-sm text-blue-100">Estado de tus compras</p>
          </Link>
          
          <Link
            to="/"
            className="bg-white bg-opacity-20 p-4 rounded-lg hover:bg-opacity-30 transition-colors text-left block"
          >
            <FaShoppingBag className="text-2xl mb-2" />
            <p className="font-medium">Seguir Comprando</p>
            <p className="text-sm text-blue-100">Explorar productos</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;