import React, { useContext, useEffect, useRef, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayPYGCurrency from '../helpers/displayCurrency';
import { FaAngleLeft, FaAngleRight, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import scrollTop from '../helpers/scrollTop';

const VerticalCardProduct = ({ category, subcategory, heading }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);
    const loadingList = new Array(6).fill(null);

    const scrollElement = useRef();

    const { fetchUserAddToCart } = useContext(Context);

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        addToCart(e, product);
        fetchUserAddToCart();
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const categoryProduct = await fetchCategoryWiseProduct(category, subcategory);
            setData(categoryProduct?.data || []);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [category, subcategory]);

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
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', checkScrollPosition);
            checkScrollPosition();
            return () => scrollContainer.removeEventListener('scroll', checkScrollPosition);
        }
    }, []);

    const calculateDiscount = (price, sellingPrice) => {
        if (price && price > 0) {
            const discount = Math.round(((price - sellingPrice) / price) * 100);
            return discount > 0 ? `${discount}% OFF` : null;
        }
        return null;
    };

    // Si no hay datos y terminó de cargar, no renderizar nada
    if (!loading && data.length === 0) {
        return null;
    }

    // Filtrar para mostrar solo placas madre si la categoría es informática
    const filteredData = category === "informatica" && subcategory === "placas_madre" 
        ? data.filter(product => product.subcategory?.toLowerCase() === "placas_madre")
        : data;

    return (
        <div className='w-full relative'>
            {heading && (
                <div className='flex justify-between items-center mb-6'>
                    <div>
                        <h2 className='text-2xl sm:text-3xl font-bold text-gray-800'>{heading}</h2>
                        <div className='h-1 w-20 bg-blue-600 mt-2 rounded-full'></div>
                    </div>
                    <Link 
                        to={`/product-category?category=${category}${subcategory ? `&subcategory=${subcategory}` : ''}`}
                        className='text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors flex items-center'
                        onClick={scrollTop}
                    >
                        Ver todos <FaAngleRight className='ml-1 transition-transform hover:translate-x-1' />
                    </Link>
                </div>
            )}

            <div className='relative group'>
                {/* Botones de scroll */}
                {showLeftButton && (
                    <button
                        className='absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
                                bg-white shadow-lg rounded-full p-3 hover:bg-blue-50 
                                transition-all duration-300 -translate-x-2
                                opacity-0 group-hover:opacity-100 group-hover:translate-x-0 hidden md:block'
                        onClick={scrollLeft}
                        aria-label="Scroll izquierda"
                    >
                        <FaAngleLeft className='text-gray-700' />
                    </button>
                )}
                
                {showRightButton && (
                    <button
                        className='absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
                                bg-white shadow-lg rounded-full p-3 hover:bg-blue-50 
                                transition-all duration-300 translate-x-2
                                opacity-0 group-hover:opacity-100 group-hover:translate-x-0 hidden md:block'
                        onClick={scrollRight}
                        aria-label="Scroll derecha"
                    >
                        <FaAngleRight className='text-gray-700' />
                    </button>
                )}

                {/* Contenedor de productos */}
                <div
                    ref={scrollElement}
                    className='flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-4 snap-x'
                >
                    {loading
                        ? loadingList.map((_, index) => (
                            <div
                                key={index}
                                className='snap-center flex-none w-[220px] sm:w-[250px] md:w-[280px] bg-white rounded-xl shadow-md animate-pulse'
                            >
                                <div className='bg-gray-200 h-48 rounded-t-xl'></div>
                                <div className='p-5 space-y-3'>
                                    <div className='h-4 bg-gray-300 rounded-full'></div>
                                    <div className='h-4 bg-gray-300 rounded-full w-2/3'></div>
                                    <div className='h-10 bg-gray-300 rounded-full'></div>
                                </div>
                            </div>
                        ))
                        : filteredData.map((product) => {
                            const discount = calculateDiscount(product?.price, product?.sellingPrice);
                            
                            return (
                                <Link 
                                    to={`/product/${product?._id}`} 
                                    key={product?._id} 
                                    className='snap-center flex-none w-[220px] sm:w-[250px] md:w-[280px] bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group/card product-card relative'
                                    onClick={scrollTop}
                                >
                                    {/* Etiqueta de descuento */}
                                    {discount && (
                                        <div className='absolute top-4 left-4 z-10 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold'>
                                            {discount}
                                        </div>
                                    )}
                                    
                                    {/* Imagen del producto */}
                                    <div className='block bg-white h-48 rounded-t-xl flex items-center justify-center overflow-hidden'>
                                        <img
                                            src={product.productImage[0]}
                                            alt={product.productName}
                                            className='object-contain h-full w-full transform group-hover/card:scale-110 transition-transform duration-500'
                                        />
                                    </div>

                                    {/* Detalles del producto */}
                                    <div className='p-5 space-y-3'>
                                        <h2 className='font-bold text-base text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors'>
                                            {product?.productName}
                                        </h2>
                                        
                                        <div className='flex items-center justify-between'>
                                            <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
                                                {product?.brandName}
                                            </span>
                                            <div className='flex flex-col items-end'>
                                                <p className='text-green-600 font-bold text-base'>
                                                    {displayPYGCurrency(product?.sellingPrice)}
                                                </p>
                                                {product?.price > 0 && (
                                                    <p className='text-gray-400 line-through text-xs'>
                                                        {displayPYGCurrency(product?.price)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleAddToCart(e, product);
                                            }}
                                            className='w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 
                                                    text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors active:scale-95'
                                        >
                                            <FaShoppingCart /> Agregar al Carrito
                                        </button>
                                    </div>
                                </Link>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default VerticalCardProduct;