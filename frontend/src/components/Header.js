import React, { useContext, useState } from 'react';
import { GrSearch } from "react-icons/gr";
import { CiUser, CiShoppingCart, CiHome } from "react-icons/ci";
import { BiCategoryAlt } from "react-icons/bi";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';
import productCategory from '../helpers/productCategory';
import { FaWhatsapp } from "react-icons/fa";

// Función scrollTop mejorada
const scrollTop = () => {
  if ('scrollBehavior' in document.documentElement.style) {
    // Método moderno con comportamiento suave
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  } else {
    // Fallback para navegadores que no soportan scrollBehavior
    const scrollToTop = () => {
      const currentPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;

      if (currentPosition > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, currentPosition - currentPosition / 8); // Ajusta la velocidad del scroll
      }
    };

    scrollToTop();
  }

  // Manejo adicional para iOS (Safari móvil)
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    document.body.scrollTop = 0; // Para Safari en iOS
    document.documentElement.scrollTop = 0; // Alternativa

    // Forzar un redibujado en caso de que el scroll no se actualice
    setTimeout(() => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 100); // Timeout para asegurar que se ejecute después de cualquier operación pendiente
  }

  // Respaldar con un timeout para asegurar que el scroll se complete
  setTimeout(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, 200); // Timeout adicional como respaldo
};

const Header = () => {
  const user = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [desktopCategoryMenuOpen, setDesktopCategoryMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: 'include'
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
    }
    if (data.error) {
      toast.error(data.message);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    navigate(`/buscar?q=${value}`);
  };

  const toggleCategoryMenu = () => setCategoryMenuOpen(!categoryMenuOpen);
  const toggleDesktopCategoryMenu = () => setDesktopCategoryMenuOpen(!desktopCategoryMenuOpen);
  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);
  const toggleMobileSearch = () => setShowMobileSearch(!showMobileSearch);

  return (
    <header className="bg-white shadow-lg fixed w-full top-0 z-50">
      {/* Versión de escritorio */}
      <div className="container mx-auto px-4 lg:px-6 h-20 hidden lg:flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center" onClick={scrollTop}>
          <img src="/logo.jpg" alt="JM Computers" className="w-20" />
        </Link>

        {/* Categorías con menú desplegable */}
        <div className="relative">
          <button 
            onClick={toggleDesktopCategoryMenu}
            className="flex items-center text-gray-700 hover:text-green-600 transition"
          >
            <BiCategoryAlt className="mr-2 text-xl" />
            Categorías
          </button>

          {desktopCategoryMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white shadow-lg rounded-lg border">
              <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                {productCategory.map((category) => (
                  <div 
                    key={category.id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="bg-green-50 p-4 border-b border-green-100">
                      <h2 className="text-lg font-bold text-green-800 flex items-center justify-between">
                        {category.label}
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 text-green-600" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 10l-2.293 2.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                        </svg>
                      </h2>
                    </div>
                    
                    <div>
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          to={`/categoria-producto?category=${category.value}&subcategory=${subcategory.value}`}
                          className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-green-50 transition-colors group"
                          onClick={() => {
                            setDesktopCategoryMenuOpen(false);
                            scrollTop();
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-700 group-hover:text-green-600 transition-colors">
                              {subcategory.label}
                            </span>
                          </div>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Barra de búsqueda */}
        <div className="flex items-center flex-1 justify-center mx-8">
          <div className="flex items-center w-full max-w-md border rounded-full shadow-md focus-within:shadow-lg pl-4">
            <input
              type="text"
              placeholder="Busca tus productos..."
              className="w-full outline-none py-2 text-gray-600"
              onChange={handleSearch}
              value={search}
            />
            <div className="text-xl p-2 text-gray-500">
              <GrSearch className="cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Carrito */}
        <div className="flex items-center gap-6">
          <Link to="/carrito" className="relative" onClick={scrollTop}>
            <CiShoppingCart className="text-3xl text-gray-600 hover:text-green-600 transition" />
            {context?.cartProductCount > 0 && (
              <div className="absolute -top-2 -right-3 w-5 h-5 text-xs text-white bg-green-600 rounded-full flex items-center justify-center">
                {context?.cartProductCount}
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Versión móvil */}
      <div className="lg:hidden flex flex-col">
        {/* Barra superior con logo y iconos */}
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={scrollTop}>
            <img src="/logo.jpg" alt="JM Computers" className="h-10" />
          </Link>

          {/* Iconos: búsqueda y carrito */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleMobileSearch}
              className="text-gray-600 hover:text-green-600"
            >
              <GrSearch className="text-2xl" />
            </button>
            <Link to="/carrito" className="relative" onClick={scrollTop}>
              <CiShoppingCart className="text-2xl text-gray-600 hover:text-green-600 transition" />
              {context?.cartProductCount > 0 && (
                <div className="absolute -top-2 -right-3 w-5 h-5 text-xs text-white bg-green-600 rounded-full flex items-center justify-center">
                  {context?.cartProductCount}
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* Barra de búsqueda móvil expandible */}
        {showMobileSearch && (
          <div className="px-4 pb-3 pt-1 bg-white shadow-md">
            <div className="flex items-center w-full border rounded-full shadow-md focus-within:shadow-lg pl-4 pr-2">
              <input
                type="text"
                placeholder="Busca tus productos..."
                className="w-full outline-none py-2 text-gray-600 text-sm"
                onChange={handleSearch}
                value={search}
                autoFocus
              />
              <button 
                onClick={toggleMobileSearch}
                className="text-sm text-gray-600 hover:text-green-600 py-1 px-2"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Menú lateral de categorías para móvil */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white w-80 shadow-lg transform ${
          categoryMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 z-50 overflow-y-auto`}
      >
        <header className="sticky top-0 bg-green-600 text-white p-4 flex items-center justify-between z-10 shadow-md">
          <h1 className="text-xl font-semibold">Categorías</h1>
          <button 
            onClick={toggleCategoryMenu} 
            className="text-white hover:bg-green-700 rounded-full p-1"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="p-4 space-y-6">
          {productCategory.map((category) => (
            <div 
              key={category.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="bg-green-50 p-4 border-b border-green-100">
                <h2 className="text-lg font-bold text-green-800 flex items-center justify-between">
                  {category.label}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-green-600" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 10l-2.293 2.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </h2>
              </div>
              
              <div>
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    to={`/categoria-producto?category=${category.value}&subcategory=${subcategory.value}`}
                    className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-green-50 transition-colors group"
                    onClick={() => {
                      toggleCategoryMenu();
                      scrollTop();
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-700 group-hover:text-green-600 transition-colors">
                        {subcategory.label}
                      </span>
                    </div>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barra de navegación móvil */}
      <div className="lg:hidden fixed bottom-0 w-full bg-white shadow-inner border-t p-2 flex justify-around">
        <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-green-600" onClick={scrollTop}>
          <CiHome className="text-2xl" />
          <span className="text-xs">Inicio</span>
        </Link>
        <button onClick={() => { toggleCategoryMenu(); scrollTop(); }} className="flex flex-col items-center text-gray-600 hover:text-green-600">
          <BiCategoryAlt className="text-2xl" />
          <span className="text-xs">Categorías</span>
        </button>
        <Link to="/carrito" className="flex flex-col items-center text-gray-600 hover:text-green-600" onClick={scrollTop}>
          <CiShoppingCart className="text-2xl" />
          <span className="text-xs">Carrito</span>
        </Link>
        <a 
          href="https://wa.me/+595972971353?text=Hola,%20estoy%20interesado%20en%20obtener%20información%20sobre%20insumos%20de%20tecnología." 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center text-gray-600 hover:text-green-600"
          onClick={scrollTop}
        >
          <FaWhatsapp className="text-2xl" />
          <span className="text-xs">WhatsApp</span>
        </a>
      </div>
    </header>
  );
};

export default Header;