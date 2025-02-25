import React, { useContext, useEffect, useRef, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayPYGCurrency from '../helpers/displayCurrency';
import { FaAngleLeft, FaAngleRight, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import scrollTop from '../helpers/scrollTop'; // Importa la función scrollTop

const VerticalCardProduct = ({ category, heading }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadingList = new Array(6).fill(null);

    const scrollElement = useRef();

    const { fetchUserAddToCart } = useContext(Context);

    const handleAddToCart = async (e, id) => {
        e.preventDefault();
        await addToCart(e, id);
        fetchUserAddToCart();
    };

    const fetchData = async () => {
        setLoading(true);
        const categoryProduct = await fetchCategoryWiseProduct(category);
        setLoading(false);
        setData(categoryProduct?.data);
    };

    useEffect(() => {
        fetchData();
    }, [category]);

    const scrollRight = () => {
        scrollElement.current.scrollBy({ left: 300, behavior: 'smooth' });
    };

    const scrollLeft = () => {
        scrollElement.current.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const calculateDiscount = (price, sellingPrice) => {
        if (price && price > 0) {
            const discount = Math.round(((price - sellingPrice) / price) * 100);
            return discount > 0 ? `${discount}% OFF` : null;
        }
        return null;
    };

    return (
        <div className='container mx-auto px-4 my-10 relative'>
            <div className='flex justify-between items-center mb-6'>
                <div>
                    <h2 className='text-3xl font-bold text-gray-800'>{heading}</h2>
                    <div className='h-1 w-20 bg-green-600 mt-2 rounded-full'></div>
                </div>
                <Link 
                    to={`/product-category?category=informatica&subcategory=notebooks`} 
                    className='text-green-600 hover:text-green-700 text-sm font-semibold transition-colors flex items-center'
                >
                    Ver todos <FaAngleRight className='ml-1' />
                </Link>
            </div>

            <div className='relative group'>
                {/* Scroll Buttons */}
                <button
                    className='absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
                             bg-white shadow-lg rounded-full p-3 hover:bg-green-50 
                             transition-all duration-300 -translate-x-2
                             opacity-0 group-hover:opacity-100 group-hover:translate-x-0 hidden md:block'
                    onClick={scrollLeft}
                >
                    <FaAngleLeft className='text-gray-700' />
                </button>
                <button
                    className='absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
                             bg-white shadow-lg rounded-full p-3 hover:bg-green-50 
                             transition-all duration-300 translate-x-2
                             opacity-0 group-hover:opacity-100 group-hover:translate-x-0 hidden md:block'
                    onClick={scrollRight}
                >
                    <FaAngleRight className='text-gray-700' />
                </button>

                {/* Product Container */}
                <div
                    ref={scrollElement}
                    className='flex gap-6 overflow-x-auto scrollbar-none scroll-smooth py-4 snap-x'
                >
                    {loading
                        ? loadingList.map((_, index) => (
                            <div
                                key={index}
                                className='snap-center w-full min-w-[240px] md:min-w-[280px] max-w-[240px] md:max-w-[280px] bg-white rounded-xl shadow-md animate-pulse'
                            >
                                <div className='bg-gray-200 h-48 rounded-t-xl'></div>
                                <div className='p-5 space-y-3'>
                                    <div className='h-4 bg-gray-300 rounded-full'></div>
                                    <div className='h-4 bg-gray-300 rounded-full w-2/3'></div>
                                    <div className='h-10 bg-gray-300 rounded-full'></div>
                                </div>
                            </div>
                        ))
                        : data.map((product, index) => {
                            const discount = calculateDiscount(product?.price, product?.sellingPrice);
                            
                            return (
                                <Link 
                                    to={`/product/${product?._id}`} 
                                    key={product?._id} 
                                    className='snap-center w-full min-w-[240px] md:min-w-[280px] max-w-[240px] md:max-w-[280px] bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group/card relative'
                                    onClick={scrollTop} // Agrega scrollTop aquí
                                >
                                    {/* Discount Badge */}
                                    {discount && (
                                        <div className='absolute top-4 left-4 z-10 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold'>
                                            {discount}
                                        </div>
                                    )}
                                    
                                    {/* Product Image */}
                                    <div className='block bg-gray-50 h-48 rounded-t-xl flex items-center justify-center overflow-hidden'>
                                        <img
                                            src={product.productImage[0]}
                                            alt={product.productName}
                                            className='object-contain h-full w-full transform group-hover/card:scale-110 transition-transform duration-500'
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className='p-5 space-y-3'>
                                        <h2 className='font-bold text-base text-gray-800 line-clamp-2 hover:text-green-600 transition-colors'>
                                            {product?.productName}
                                        </h2>
                                        
                                        <div className='flex items-center justify-between'>
                                            <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full'>
                                                {product?.subcategory}
                                            </span>
                                            <div className='flex items-center gap-2'>
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
                                                e.preventDefault(); // Evita la propagación del evento
                                                handleAddToCart(e, product?._id);
                                            }}
                                            className='w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 
                                                     text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors'
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