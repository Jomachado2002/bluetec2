import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayPYGCurrency from '../helpers/displayCurrency';
import { FaAngleLeft, FaAngleRight, FaShoppingCart, FaMemory, FaHdd, FaMicrochip } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import scrollTop from '../helpers/scrollTop';

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const loadingList = new Array(13).fill(null);
  const scrollElement = useRef();
  const { fetchUserAddToCart } = useContext(Context);
  const location = useLocation();
  const { pathname } = location;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const categoryProduct = await fetchCategoryWiseProduct(category);
      setData(categoryProduct?.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const scrollRight = () => {
    scrollElement.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const scrollLeft = () => {
    scrollElement.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const checkScrollPosition = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollElement.current;
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth);
  };

  useEffect(() => {
    const scrollContainer = scrollElement.current;
    scrollContainer.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition();
    return () => scrollContainer.removeEventListener('scroll', checkScrollPosition);
  }, []);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    e.stopPropagation(); // Evita que el clic se propague al Link padre
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const calculateDiscount = (price, sellingPrice) => {
    if (price && price > 0) {
      const discount = Math.round(((price - sellingPrice) / price) * 100);
      return discount > 0 ? `${discount}% OFF` : null;
    }
    return null;
  };

  return (
    <div className="w-full px-2 sm:px-4 my-4 sm:my-8 relative">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{heading}</h2>
          <div className="h-1 w-16 sm:w-20 bg-green-600 mt-2 rounded-full"></div>
        </div>
        <Link 
          to={`/product-category?category=informatica&subcategory=notebooks`} 
          className="text-green-600 hover:text-green-700 text-sm font-semibold transition-colors flex items-center"
          onClick={scrollTop}
        >
          Ver todos <FaAngleRight className="ml-1" />
        </Link>
      </div>

      <div className="relative group">
        {showLeftButton && (
          <button 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
                     bg-white shadow-lg rounded-full p-2 sm:p-3 hover:bg-green-50 
                     transition-all duration-300 -translate-x-2
                     opacity-0 group-hover:opacity-100 group-hover:translate-x-0
                     hidden sm:block" 
            onClick={scrollLeft}
          >
            <FaAngleLeft className="text-gray-700" />
          </button>
        )}

        <div 
          className="flex gap-3 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth py-2 sm:py-4" 
          ref={scrollElement}
        >
          {loading ? loadingList.map((_, index) => (
            <div 
              key={index} 
              className="flex-none w-[240px] sm:w-[280px] lg:w-[320px] h-[220px] sm:h-[260px] lg:h-[280px] 
                       bg-white rounded-xl shadow-md flex"
            >
              <div className="bg-slate-200 h-full w-1/3 rounded-l-xl"></div>
              <div className="p-3 sm:p-4 w-2/3">
                <div className="h-4 bg-slate-200 rounded mb-3"></div>
                <div className="h-3 bg-slate-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded mb-2 w-1/2"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </div>
            </div>
          )) : data.map((product, index) => {
            const discount = calculateDiscount(product?.price, product?.sellingPrice);
            
            return (
              <Link
                to={`${pathname}product/${product?._id}`}
                onClick={scrollTop}
                key={index}
                className="flex-none w-[240px] sm:w-[280px] lg:w-[320px] h-[220px] sm:h-[260px] lg:h-[280px]
                         bg-white rounded-xl shadow-md hover:shadow-xl flex overflow-hidden 
                         transition-all duration-300 group/card cursor-pointer"
                onMouseEnter={() => setHoveredProduct(product._id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {discount && (
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 
                               bg-green-600 text-white px-2 sm:px-3 py-1 
                               rounded-full text-xs font-bold">
                    {discount}
                  </div>
                )}

                <div className="w-1/3 h-full bg-gray-50 flex items-center justify-center p-2 sm:p-4">
                  <img 
                    src={product.productImage[0]} 
                    alt={product?.productName} 
                    className="object-contain h-full w-full transform 
                             group-hover/card:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-3 sm:p-4 lg:p-6 w-2/3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="font-bold text-xs sm:text-sm text-gray-800 text-ellipsis line-clamp-2 hover:text-green-600">
                        {product?.productName}
                      </h2>
                      <span className="text-xs text-gray-500 font-medium bg-gray-100 
                                   px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                        {product?.brandName}
                      </span>
                    </div>

                    {hoveredProduct === product._id && (
                      <div className="space-y-1 sm:space-y-2 mt-2 sm:mt-3 animate-fadeIn">
                        <div className="flex items-center text-xs text-gray-600">
                          <FaMicrochip className="mr-1 sm:mr-2" /> 
                          <span className="text-[10px] sm:text-xs truncate">
                            {product?.processor || 'Procesador no especificado'}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <FaMemory className="mr-1 sm:mr-2" />
                          <span className="text-[10px] sm:text-xs truncate">
                            {product?.ram || 'RAM no especificada'}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <FaHdd className="mr-1 sm:mr-2" />
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
                      onClick={(e) => handleAddToCart(e, product?._id)}
                      className="w-full flex items-center justify-center gap-1 sm:gap-2 
                               bg-green-600 hover:bg-green-700 text-white 
                               px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg 
                               text-xs sm:text-sm font-semibold transition-colors"
                    >
                      <FaShoppingCart className="text-xs sm:text-sm" /> 
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {showRightButton && (
          <button 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
                     bg-white shadow-lg rounded-full p-2 sm:p-3 hover:bg-green-50 
                     transition-all duration-300 translate-x-2
                     opacity-0 group-hover:opacity-100 group-hover:translate-x-0
                     hidden sm:block" 
            onClick={scrollRight}
          >
            <FaAngleRight className="text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

export default HorizontalCardProduct;