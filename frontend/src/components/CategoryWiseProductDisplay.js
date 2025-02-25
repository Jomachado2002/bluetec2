import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import displayPYGCurrency from '../helpers/displayCurrency';
import scrollTop from '../helpers/scrollTop';

const CategoryWiseProductDisplay = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const loadingList = new Array(13).fill(null);

  const scrollElement = useRef();

  const { fetchUserAddToCart } = useContext(Context);

  // Función para manejar la acción de agregar al carrito
  const handleAddToCart = useCallback(
    async (e, id) => {
      await addToCart(e, id);
      fetchUserAddToCart();
    },
    [fetchUserAddToCart]
  );

  // Función para obtener datos
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const categoryProduct = await fetchCategoryWiseProduct(category);
      setData(categoryProduct?.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  // useEffect para cargar datos
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Función para desplazar a la derecha
  const scrollRight = () => {
    scrollElement.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  // Función para desplazar a la izquierda
  const scrollLeft = () => {
    scrollElement.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  // Función para verificar la posición del scroll
  const checkScrollPosition = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollElement.current;
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth);
  };

  // useEffect para verificar la posición del scroll
  useEffect(() => {
    const scrollContainer = scrollElement.current;
    scrollContainer.addEventListener('scroll', checkScrollPosition);
    return () => scrollContainer.removeEventListener('scroll', checkScrollPosition);
  }, []);

  return (
    <div className='container mx-auto px-4 my-6 relative'>
      <h2 className='text-2xl font-semibold py-4'>{heading}</h2>

      <div className='relative'>
        {showLeftButton && (
          <button
            className='bg-white shadow-lg rounded-full p-2 absolute left-0 top-1/2 transform -translate-y-1/2 z-10'
            onClick={scrollLeft}
          >
            <FaAngleLeft className='text-gray-700' />
          </button>
        )}

        <div
          className='flex gap-4 overflow-x-scroll scrollbar-none scroll-smooth'
          ref={scrollElement}
        >
          {loading
            ? loadingList.map((_, index) => (
                <div
                  key={index}
                  className='w-full min-w-[240px] md:min-w-[280px] max-w-[240px] md:max-w-[280px] bg-white rounded-lg shadow-md animate-pulse'
                >
                  <div className='bg-gray-200 h-40 flex justify-center items-center rounded-t-lg'></div>
                  <div className='p-4 space-y-2'>
                    <div className='h-4 bg-gray-300 rounded-full'></div>
                    <div className='h-4 bg-gray-300 rounded-full w-2/3'></div>
                    <div className='flex gap-2'>
                      <div className='h-4 bg-gray-300 rounded-full w-1/2'></div>
                      <div className='h-4 bg-gray-300 rounded-full w-1/3'></div>
                    </div>
                    <div className='h-8 bg-gray-300 rounded-full'></div>
                  </div>
                </div>
              ))
            : data.map((product, index) => (
                <Link
                  to={'/product/' + product?._id}
                  key={product?._id}
                  className='w-full min-w-[240px] md:min-w-[280px] max-w-[240px] md:max-w-[280px] bg-white rounded-lg shadow-md hover:shadow-lg transition-all'
                  onClick={scrollTop}
                >
                  <div className='bg-white h-40 flex justify-center items-center rounded-t-lg overflow-hidden'>
                    <img
                      src={product.productImage[0]}
                      alt={product.productName}
                      className='object-contain h-full w-full hover:scale-110 transition-transform'
                    />
                  </div>
                  <div className='p-4 grid gap-3'>
                    <h2 className='font-medium text-base text-ellipsis line-clamp-1 text-black'>
                      {product?.productName}
                    </h2>
                    <p className='capitalize text-gray-500 text-sm'>{product?.subcategory}</p>
                    <div className='flex gap-3 items-center justify-center'>
                      <p className='text-red-600 font-semibold text-sm'>
                        {displayPYGCurrency(product?.sellingPrice)}
                      </p>
                      <p className='text-gray-400 line-through text-xs'>
                        {displayPYGCurrency(product?.price)}
                      </p>
                    </div>
                    <div className='flex justify-center mt-2'>
                      <button
                        className='text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full'
                        onClick={(e) => handleAddToCart(e, product?._id)}
                      >
                        Agregar al Carrito
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        {showRightButton && (
          <button
            className='bg-white shadow-lg rounded-full p-2 absolute right-0 top-1/2 transform -translate-y-1/2 z-10'
            onClick={scrollRight}
          >
            <FaAngleRight className='text-gray-700' />
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;