// frontend/src/pages/UserAccount.js
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaUser, 
  FaShoppingBag, 
  FaMapMarkerAlt, 
  FaCog, 
  FaSignOutAlt,
  FaHome,
  FaHeart,
  FaHeadset
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../../../../bluetec2/frontend/src/store/userSlice';
import SummaryApi from '../../../../bluetec2/frontend/src/common';

const UserAccount = () => {
  const user = useSelector(state => state?.user?.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userData, setUserData] = useState({});

  // Cargar datos del usuario desde localStorage
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    setUserData(storedUserData);
  }, []);

  // Verificar si el usuario está logueado
  useEffect(() => {
    if (!user) {
      navigate('/iniciar-sesion');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      const fetchData = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: 'include'
      });

      const data = await fetchData.json();

      if (data.success) {
        toast.success(data.message);
        dispatch(setUserDetails(null));
        // Limpiar datos del usuario en localStorage (mantener carrito)
        localStorage.removeItem('userData');
        navigate('/');
      } else {
        toast.error(data.message || "Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error de conexión");
    }
  };

  // Menú de navegación
  const menuItems = [
    {
      path: 'dashboard',
      label: 'Inicio',
      icon: <FaHome className="w-5 h-5" />,
      description: 'Resumen de tu cuenta'
    },
    {
      path: 'pedidos',
      label: 'Mis Pedidos',
      icon: <FaShoppingBag className="w-5 h-5" />,
      description: 'Historial de compras'
    },
    {
      path: 'wishlist',
      label: 'Lista de Deseos',
      icon: <FaHeart className="w-5 h-5" />,
      description: 'Productos guardados'
    },
    {
      path: 'perfil',
      label: 'Mi Perfil',
      icon: <FaUser className="w-5 h-5" />,
      description: 'Datos personales'
    },
    {
      path: 'direcciones',
      label: 'Direcciones',
      icon: <FaMapMarkerAlt className="w-5 h-5" />,
      description: 'Direcciones de envío'
    },
    {
      path: 'configuracion',
      label: 'Configuración',
      icon: <FaCog className="w-5 h-5" />,
      description: 'Preferencias'
    },
    {
      path: 'soporte',
      label: 'Soporte',
      icon: <FaHeadset className="w-5 h-5" />,
      description: 'Ayuda y contacto'
    }
  ];

  // Función para verificar si una ruta está activa
  const isActiveRoute = (path) => {
    const currentPath = location.pathname.split('/').pop();
    return currentPath === path || (currentPath === 'mi-cuenta' && path === 'dashboard');
  };

  // Obtener estadísticas rápidas
  const getQuickStats = () => {
    const orders = userData.orders || [];
    const wishlist = userData.wishlist || [];
    
    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter(order => order.status === 'paid' || order.status === 'shipped').length,
      wishlistItems: wishlist.length,
      totalSpent: orders.reduce((sum, order) => sum + (order.totals?.total || 0), 0)
    };
  };

  const stats = getQuickStats();

  if (!user) {
    return null; // O un spinner de carga
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header del Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-16 h-16 bg-[#002060] rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Hola, {user.name || 'Usuario'}
                </h1>
                <p className="text-gray-600">Bienvenido a tu panel personal</p>
              </div>
            </div>
            
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-lg font-bold text-[#002060]">{stats.totalOrders}</div>
                <div className="text-sm text-gray-600">Pedidos</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-lg font-bold text-green-600">{stats.pendingOrders}</div>
                <div className="text-sm text-gray-600">En proceso</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-lg font-bold text-red-600">{stats.wishlistItems}</div>
                <div className="text-sm text-gray-600">Favoritos</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-lg font-bold text-purple-600">
                  {new Intl.NumberFormat('es-PY', { 
                    style: 'currency', 
                    currency: 'PYG',
                    minimumFractionDigits: 0 
                  }).format(stats.totalSpent)}
                </div>
                <div className="text-sm text-gray-600">Total gastado</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar de navegación */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Mi Cuenta</h2>
                
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActiveRoute(item.path)
                          ? 'bg-[#002060] text-white shadow-md'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-[#002060]'
                      }`}
                    >
                      <span className={`mr-3 transition-transform group-hover:scale-110 ${
                        isActiveRoute(item.path) ? 'text-white' : 'text-gray-500'
                      }`}>
                        {item.icon}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className={`text-xs ${
                          isActiveRoute(item.path) ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </nav>

                {/* Botón de cerrar sesión */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaSignOutAlt className="w-5 h-5 mr-3" />
                    <span className="font-medium">Cerrar Sesión</span>
                  </button>
                </div>

                {/* Enlaces rápidos */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <Link 
                      to="/" 
                      className="block text-sm text-gray-600 hover:text-[#002060] transition-colors"
                    >
                      ← Volver a la tienda
                    </Link>
                    <Link 
                      to="/carrito" 
                      className="block text-sm text-gray-600 hover:text-[#002060] transition-colors"
                    >
                      🛒 Ver mi carrito
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <Outlet context={{ userData, setUserData }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;