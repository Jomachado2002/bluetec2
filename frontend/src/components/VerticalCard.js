import React, { useContext, useRef, useState } from 'react';
import scrollTop from '../helpers/scrollTop';
import Context from '../context';
import addToCart from '../helpers/addToCart';
import { Link } from 'react-router-dom';
import displayPYGCurrency from '../helpers/displayCurrency';
import { FaShoppingCart, FaExpand } from 'react-icons/fa';

const VerticalCard = ({ loading, data = [] }) => {
    const loadingList = new Array(13).fill(null);
    const { fetchUserAddToCart } = useContext(Context);
    const cardContainerRef = useRef(null);
    const [hoveredProductId, setHoveredProductId] = useState(null);

    // Modificado para pasar todo el objeto producto
    const handleAddToCart = (e, product) => {
        e.stopPropagation(); // Evita que el clic se propague al Link
        addToCart(e, product);
        fetchUserAddToCart();
    };

    const calculateDiscount = (price, sellingPrice) => {
        if (price && price > 0) {
            const discount = Math.round(((price - sellingPrice) / price) * 100);
            return discount > 0 ? `${discount}% OFF` : null;
        }
        return null;
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowRight') {
            cardContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        } else if (e.key === 'ArrowLeft') {
            cardContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    return (
        <div 
            className='grid grid-cols-[repeat(auto-fit,minmax(260px,300px))] justify-center md:justify-between md:gap-4 overflow-x-scroll scrollbar-none transition-all' 
            ref={cardContainerRef} 
            tabIndex={0} 
            onKeyDown={handleKeyDown}
        >
            {
                loading ? (
                    loadingList.map((product, index) => (
                        <div 
                            key={index} 
                            className='w-full min-w-[280px] md:min-w-[300px] max-w-[300px] bg-white rounded-xl shadow-lg animate-pulse relative overflow-hidden'
                        >
                            <div className='bg-slate-200 h-48 rounded-t-xl'></div>
                            <div className='p-5 space-y-3'>
                                <div className='h-4 bg-slate-300 rounded-full'></div>
                                <div className='h-4 bg-slate-300 rounded-full w-2/3'></div>
                                <div className='flex gap-3'>
                                    <div className='h-4 bg-slate-300 rounded-full w-1/2'></div>
                                    <div className='h-4 bg-slate-300 rounded-full w-1/2'></div>
                                </div>
                                <div className='h-10 bg-slate-300 rounded-full'></div>
                            </div>
                        </div>
                    ))
                ) : (
                    data.map((product, index) => {
                        const discount = calculateDiscount(product?.price, product?.sellingPrice);
                        
                        return (
                            <Link 
                                to={`/producto/${product?._id}`} 
                                key={index} 
                                className='block w-full min-w-[280px] md:min-w-[300px] max-w-[300px] bg-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative group/card'
                                onClick={scrollTop} // Desplaza la página hacia arriba al hacer clic
                                onMouseEnter={() => setHoveredProductId(product?._id)}
                                onMouseLeave={() => setHoveredProductId(null)}
                            >
                                {/* Discount Badge */}
                                {discount && (
                                    <div className='absolute top-4 left-4 z-10 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold'>
                                        {discount}
                                    </div>
                                )}

                                {/* Product Image */}
                                <div className='bg-gray-50 h-48 rounded-t-xl flex items-center justify-center overflow-hidden relative'>
                                    <img 
                                        src={product?.productImage[0]} 
                                        alt={product?.productName} 
                                        className='object-contain h-full w-full transform group-hover/card:scale-110 transition-transform duration-500'
                                    />
                                    <div className='absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300'>
                                        <div className='bg-white/70 p-2 rounded-full'>
                                            <FaExpand className='text-gray-700' />
                                        </div>
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className='p-5 space-y-3'>
                                    <h2 
                                        className={`font-semibold text-base text-gray-700 ${
                                            hoveredProductId === product?._id 
                                                ? 'line-clamp-none' 
                                                : 'line-clamp-2'
                                        } hover:line-clamp-none transition-all duration-300`}
                                    >
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
                                            {product?.price > 0 && !discount && (
                                                <p className='text-gray-400 line-through text-xs'>
                                                    {displayPYGCurrency(product?.price)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Add to Cart Button - Modificado para pasar todo el producto */}
                                    <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        className='w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 
                                                 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors'
                                    >
                                        <FaShoppingCart /> Agregar al Carrito
                                    </button>
                                </div>
                            </Link>
                        );
                    })
                )
            }
        </div>
    );
};

export default VerticalCard;