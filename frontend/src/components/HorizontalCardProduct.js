import React, { useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayPYGCurrency from '../helpers/displayCurrency';
import { 
  FaAngleLeft, 
  FaAngleRight, 
  FaShoppingCart, 
  FaMemory, 
  FaHdd, 
  FaMicrochip,
  FaExpand 
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import scrollTop from '../helpers/scrollTop';

// Componente de imagen con carga optimizada
const OptimizedImage = React.memo(({ src, alt, index, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);
  const placeholderUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"%3E%3Crect width="100%25" height="100%25" fill="%23f3f4f6"/%3E%3C/svg%3E';

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          if (imgRef.current) {
            imgRef.current.src = src;
            observer.disconnect();
          }
        }
      },
      { rootMargin: '200px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.disconnect();
      }
    };
  }, [src]);

  return (
    <div className="relative w-full h-full">
      {/* Imagen placeholder */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 16 16">
            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
          </svg>
        </div>
      )}

      {/* Imagen real */}
      <img 
        ref={imgRef}
        src={index < 3 ? src : placeholderUrl} // Carga inmediata solo para las primeras 3 imágenes
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        width="150"
        height="150"
        loading={index < 3 ? "eager" : "lazy"}
      />

      {/* Imagen de error */}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )}
    </div>
  );
});

const HorizontalCardProduct = ({ 
  category, 
  subcategory = null, 
  heading 
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 5 });
  const loadingList = new Array(5).fill(null); // Reducido para mejorar rendimiento
  const scrollElement = useRef();
  const { fetchUserAddToCart } = useContext(Context);
  const location = useLocation();
  const { pathname } = location;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const categoryProduct = await fetchCategoryWiseProduct(category, subcategory);
      setData(categoryProduct?.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [category, subcategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const scrollRight = () => {
    scrollElement.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const scrollLeft = () => {
    scrollElement.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const checkScrollPosition = useCallback(() => {
    if (!scrollElement.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollElement.current;
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    
    // Actualizar rango visible para carga optimizada
    const cardWidth = 300; // Ancho aproximado de cada tarjeta
    const startIndex = Math.floor(scrollLeft / cardWidth);
    const visibleCount = Math.ceil(clientWidth / cardWidth) + 1; // +1 para precarga
    
    setVisibleRange({
      start: Math.max(0, startIndex - 1), // Precarga 1 antes
      end: startIndex + visibleCount + 1 // Precarga 1 después
    });
  }, []);

  useEffect(() => {
    const scrollContainer = scrollElement.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      // Debounce para mejorar rendimiento
      let timeoutId;
      const handleScroll = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkScrollPosition, 100);
      };
      
      scrollContainer.addEventListener('scroll', handleScroll);
      checkScrollPosition();
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
        scrollContainer.removeEventListener('scroll', handleScroll);
        clearTimeout(timeoutId);
      };
    }
  }, [checkScrollPosition]);

  // Usar useCallback para funciones de manejo de eventos
  const handleAddToCart = useCallback((e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(e, product);
    fetchUserAddToCart();
  }, [fetchUserAddToCart]);

  // Memoizar funciones de procesamiento
  const calculateDiscount = useCallback((price, sellingPrice) => {
    if (price && price > 0) {
      const discount = Math.round(((price - sellingPrice) / price) * 100);
      return discount > 0 ? `${discount}% OFF` : null;
    }
    return null;
  }, []);

  // Función para formatear el nombre del producto
  const formatProductName = useCallback((productName) => {
    if (!productName) return { mainName: '', specs: [] };
    
    // Si el nombre tiene separadores tipo "/"
    if (productName.includes(' / ')) {
      const parts = productName.split(' / ');
      return {
        mainName: parts[0],
        specs: parts.slice(1)
      };
    }
    
    // Si no tiene separadores, intentamos extraer información importante
    
    // Extraer nombre principal: normalmente es "Tipo + Marca + Modelo"
    let mainName = '';
    const devicePattern = /(Notebook|Laptop|Portátil|PC|Tablet|Teléfono|Smartphone|Monitor)\s+([A-Za-z]+)\s+([A-Za-z0-9-]+(\s+[A-Za-z0-9-]+)?)/i;
    const deviceMatch = productName.match(devicePattern);
    
    if (deviceMatch) {
      mainName = `${deviceMatch[1]} ${deviceMatch[2]} ${deviceMatch[3]}`;
    } else {
      // Si no se encuentra un patrón claro, usar las primeras 3-4 palabras
      mainName = productName.split(' ').slice(0, 4).join(' ');
    }
    
    // Extraer especificaciones clave
    const specs = [];
    
    // RAM
    const ramMatch = productName.match(/(\d+\s*GB\s*de\s*RAM|\d+\s*GB\s*RAM)/i);
    if (ramMatch) specs.push(ramMatch[0]);
    
    // Almacenamiento
    const storageMatch = productName.match(/(\d+\s*GB\s*(SSD|HDD|eMMC)|(\d+\s*TB))/i);
    if (storageMatch) specs.push(storageMatch[0]);
    
    // Procesador - capturamos solo la parte esencial
    const processorMatch = productName.match(/(Intel|AMD|Ryzen|Core i\d|Celeron|Pentium)(\s+[A-Za-z0-9-]+)?/i);
    if (processorMatch) specs.push(processorMatch[0].trim());
    
    // Pantalla
    const screenMatch = productName.match(/(Full HD|HD|FHD|4K|UHD)(\s+\d+(\.\d+)?")?|((\d+(\.\d+)?|,\d+)\s?")/i);
    if (screenMatch) {
      const screenSize = screenMatch[0].trim();
      specs.push(`Pantalla ${screenSize}`);
    }
    
    // Color o acabado
    const colorMatch = productName.match(/\s(Negro|Blanco|Gris|Plata|Azul|Rojo|Rose Gold)(\s+\([^)]+\))?(?=\s|$)/i);
    if (colorMatch) specs.push(colorMatch[0].trim());
    
    return {
      mainName: mainName.trim(),
      specs: specs.filter(spec => spec && spec.length > 0)
    };
  }, []);

  // Memoizamos los datos formateados para evitar recálculos
  const processedProducts = useMemo(() => {
    return data.map(product => ({
      ...product,
      formattedName: formatProductName(product?.productName),
      discount: calculateDiscount(product?.price, product?.sellingPrice)
    }));
  }, [data, formatProductName, calculateDiscount]);

  // If no data, don't render anything
  if (!loading && data.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-2 sm:px-4 my-4 sm:my-8 relative">
      {/* Only render header and "Ver todos" if heading is provided */}
      {heading && (
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="flex flex-col">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 hover:text-green-600 transition-colors duration-300">
              {heading}
            </h2>
            <div className="h-1 w-16 sm:w-20 bg-green-600 mt-2 rounded-full transition-all duration-500 hover:w-24"></div>
          </div>
          
          <Link 
            to={`/categoria-producto?category=${category}${subcategory ? `&subcategory=${subcategory}` : ''}`} 
            className="text-green-600 hover:text-green-700 text-sm font-semibold transition-colors flex items-center group"
            onClick={scrollTop}
          >
            Ver todos 
            <FaAngleRight className="ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}

      <div className="relative group overflow-hidden">
        {showLeftButton && (
          <button 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-2 sm:p-3 hover:bg-green-50 hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-green-300 hidden sm:block" 
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <FaAngleLeft className="text-gray-700 group-hover:text-green-600 transition-colors duration-300" />
          </button>
        )}

        <div 
          ref={scrollElement}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-2 sm:py-4 snap-x snap-mandatory"
        >
          {loading ? loadingList.map((_, index) => (
            <div 
              key={index} 
              className="flex-none w-[260px] sm:w-[300px] lg:w-[340px] h-[260px] sm:h-[300px] lg:h-[320px] bg-white rounded-xl shadow-md flex animate-pulse"
            >
              <div className="bg-slate-200 h-full w-2/5 rounded-l-xl"></div>
              <div className="p-3 sm:p-4 w-3/5">
                <div className="h-4 bg-slate-200 rounded mb-3"></div>
                <div className="h-3 bg-slate-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded mb-2 w-1/2"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </div>
            </div>
          )) : processedProducts.map((product, index) => {
            // Solo renderizar elementos visibles y algunos cercanos
            const isInVisibleRange = index >= visibleRange.start && index <= visibleRange.end;
            
            return (
              <Link to={`/producto/${product?.slug || product?._id}`}
                onClick={scrollTop}
                key={product?._id || index}
                className="flex-none w-[260px] sm:w-[300px] lg:w-[340px] h-[260px] sm:h-[300px] lg:h-[320px] bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 product-card cursor-pointer snap-center block overflow-hidden relative group/card"
                data-product-id={product?._id}
              >
                {product.discount && (
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-green-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold transform hover:scale-110 transition-transform z-10">
                    {product.discount}
                  </div>
                )}

                <div className="flex h-full">
                  <div className="w-2/5 h-full bg-white flex items-center justify-center p-2 sm:p-4 relative">
                    {isInVisibleRange ? (
                      <OptimizedImage 
                        src={product.productImage[0]} 
                        alt={product?.productName} 
                        index={index}
                        className="object-contain h-full w-full transform hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      // Placeholder hasta que entre en rango visible
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                          <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                        </svg>
                      </div>
                    )}
                    
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/70 p-1 rounded-full">
                        <FaExpand className="text-gray-700 text-xs" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 lg:p-5 w-3/5 flex flex-col justify-between">
                    <div>
                      <div className="mb-2">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded-full inline-block">
                            {product?.brandName}
                          </span>
                          
                          {/* Solo mostramos modelo si existe en la BD */}
                          {product?.modelName && (
                            <span className="text-[9px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded-full">
                              {product?.modelName}
                            </span>
                          )}
                        </div>
                        
                        {/* Título principal más compacto */}
                        <h2 
                          className="font-semibold text-xs sm:text-sm text-gray-800 hover:text-green-600 transition-colors line-clamp-2"
                          title={product?.productName}
                        >
                          {product.formattedName.mainName}
                        </h2>
                        
                        {/* Especificaciones clave en formato de chips/pills */}
                        <div className="mt-2">
                          {product.formattedName.specs.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {product.formattedName.specs.map((spec, idx) => (
                                <span key={idx} className="inline-block text-[9px] bg-gray-50 px-1.5 py-0.5 rounded-full border border-gray-100 text-gray-600">
                                  {spec}
                                </span>
                              )).slice(0, 3)} {/* Limitamos a máximo 3 especificaciones */}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Solo mostramos las especificaciones adicionales si no hay suficientes specs en el nombre */}
                      {product.formattedName.specs.length < 2 && (
                        <div className="space-y-1 sm:space-y-2">
                          <div className="flex items-center text-xs text-gray-600">
                            <FaMicrochip className="mr-1 sm:mr-2 text-gray-400 flex-shrink-0" /> 
                            <span className="text-[10px] sm:text-xs truncate">
                              {product?.processor || 'Procesador no especificado'}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <FaMemory className="mr-1 sm:mr-2 text-gray-400 flex-shrink-0" />
                            <span className="text-[10px] sm:text-xs truncate">
                              {product?.ram || 'RAM no especificada'}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <FaHdd className="mr-1 sm:mr-2 text-gray-400 flex-shrink-0" />
                            <span className="text-[10px] sm:text-xs truncate">
                              {product?.storage || 'Almacenamiento no especificado'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="mb-2 sm:mb-3">
                        <p className="text-green-600 font-bold text-base sm:text-lg">
                          {displayPYGCurrency(product?.sellingPrice)}
                        </p>
                        {product?.price > 0 && (
                          <p className="text-gray-400 line-through text-xs sm:text-sm">
                            {displayPYGCurrency(product?.price)}
                          </p>
                        )}
                      </div>

                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full flex items-center justify-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2"
                      >
                        <FaShoppingCart className="text-xs sm:text-sm" /> 
                        Agregar al Carrito
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {showRightButton && (
          <button 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-2 sm:p-3 hover:bg-green-50 hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-green-300 hidden sm:block" 
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <FaAngleRight className="text-gray-700 group-hover:text-green-600 transition-colors duration-300" />
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(HorizontalCardProduct);