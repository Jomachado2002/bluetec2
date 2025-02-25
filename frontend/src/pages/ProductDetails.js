import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SummaryApi from '../common';
import displayINRCurrency from '../helpers/displayCurrency';
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: ""
  });
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const productImageListLoading = new Array(4).fill(null);
  const [activeImage, setActiveImage] = useState("");

  // Coordenadas relativas para el zoom
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 });
  const [zoomImage, setZoomImage] = useState(false);

  const { fetchUserAddToCart } = useContext(Context);
  const navigate = useNavigate();

  const fetchProductDetails = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: params?.id })
    });
    const dataResponse = await response.json();
    setLoading(false);
    setData(dataResponse?.data);
    setActiveImage(dataResponse?.data?.productImage[0]);
  };

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // Al pasar el cursor por una miniatura se cambia la imagen activa
  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };

  // Calcula la posición relativa del cursor sobre la imagen principal
  const handleMouseMove = useCallback((e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setZoomImageCoordinate({ x, y });
    setZoomImage(true);
  }, []);

  const handleMouseLeave = () => {
    setZoomImage(false);
  };

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
    navigate("/cart");
  };

  const handleWhatsAppClick = () => {
    const message = `Hola, me interesa este producto: ${data.productName}. ¿Me puedes brindar más detalles?`;
    const whatsappUrl = `https://wa.me/+595972971353?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Calcula el porcentaje de descuento 
  const discountPercentage = data.price && data.sellingPrice && data.price > 0
    ? Math.round(((data.price - data.sellingPrice) / data.price) * 100)
    : 0;

  return (
    <div className="container mx-auto p-4 font-roboto">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex flex-col lg:flex-row gap-6 flex-1">
          {/** Sección de Imagen Principal y Zoom **/}
          <div className="relative">
            <div
              className="relative h-auto w-full lg:w-[600px] bg-gray-50 flex justify-center items-center border border-gray-200"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={activeImage}
                alt={data.productName}
                className="object-contain h-full w-full"
              />
              {/** Contenedor de Zoom (visible solo en pantallas grandes) **/}
              {zoomImage && (
                <div className="hidden lg:block absolute top-0 left-full ml-4 w-[600px] h-[500px] border border-gray-200 rounded overflow-hidden shadow-xl pointer-events-none">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url(${activeImage})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1200px 1000px',
                      backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`
                    }}
                  />
                </div>
              )}
            </div>
            {/** Sección de Miniaturas Mejoradas **/}
            <div className="flex flex-nowrap gap-2 p-2 bg-white border-t border-gray-200 mt-2 overflow-x-auto">
              {loading
                ? productImageListLoading.map((_, index) => (
                    <div key={"loadingImage" + index} className="h-16 w-16 bg-gray-200 rounded animate-pulse"></div>
                  ))
                : data?.productImage?.map((imgURL, index) => (
                    <div
                      key={imgURL}
                      className={`h-16 w-16 rounded border cursor-pointer transition-shadow duration-200 hover:shadow-md ${activeImage === imgURL ? 'border-green-500' : 'border-transparent'}`}
                      onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                      onClick={() => handleMouseEnterProduct(imgURL)}
                    >
                      <img src={imgURL} alt={`Producto ${index + 1}`} className="h-full w-full object-cover rounded" />
                    </div>
                  ))
              }
            </div>
          </div>

          {/** Sección de Detalles del Producto **/}
          <div className="flex-1 flex flex-col justify-between">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="bg-gray-200 h-6 w-1/2 rounded"></div>
                <div className="bg-gray-200 h-8 w-full rounded"></div>
                <div className="bg-gray-200 h-6 w-1/3 rounded"></div>
                <div className="flex gap-4">
                  <div className="bg-gray-200 h-10 w-32 rounded"></div>
                  <div className="bg-gray-200 h-10 w-32 rounded"></div>
                  <div className="bg-gray-200 h-10 w-32 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 w-full rounded"></div>
                  <div className="bg-gray-200 h-4 w-full rounded"></div>
                  <div className="bg-gray-200 h-4 w-full rounded"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {data?.brandName}
                  </p>
                  <h2 className="mt-2 text-2xl md:text-3xl font-bold text-gray-800">
                    {data?.productName}
                  </h2>
                  <p className="capitalize text-sm md:text-lg text-gray-500">{data?.subcategory}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-3xl lg:text-4xl font-bold text-green-700">
                    {displayINRCurrency(data.sellingPrice)}
                  </p>
                  {data.price > 0 && (
                    <>
                      <p className="text-xl lg:text-2xl text-gray-400 line-through">
                        {displayINRCurrency(data.price)}
                      </p>
                      {discountPercentage > 0 && (
                        <span className="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded-md">
                          {discountPercentage}% OFF
                        </span>
                      )}
                    </>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={(e) => handleBuyProduct(e, data?._id)}
                    className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    Comprar
                  </button>
                  <button
                    onClick={(e) => handleAddToCart(e, data?._id)}
                    className="w-full sm:w-auto bg-white text-green-600 border-2 border-green-600 py-2 px-4 rounded-lg shadow hover:bg-green-600 hover:text-white transition-all duration-300"
                  >
                    Agregar al carrito
                  </button>
                  <button
                    onClick={handleWhatsAppClick}
                    className="w-full sm:w-auto bg-white text-green-600 border-2 border-green-600 py-2 px-4 rounded-lg shadow hover:bg-green-600 hover:text-white transition-all duration-300"
                  >
                    WhatsApp
                  </button>
                </div>

                {!loading && (
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">Especificaciones</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(data)
                        .filter(([key, value]) => [
                          'processor', 'memory', 'storage', 'disk', 'graphicsCard', 'notebookScreen',
                          'monitorSize', 'monitorRefreshRate', 'cameraResolution',
                          'dvrChannels', 'nasCapacity', 'printerType', 'printerFunctions',
                          'psuWattage', 'upsCapacity', 'airpodsModel', 
                          'softwareLicenseType', 'phoneType', 'phoneStorage'
                        ].includes(key) && value)
                        .map(([key, value]) => (
                          <div key={key} className="flex flex-col sm:flex-row justify-between p-2 bg-white rounded-lg shadow-sm">
                            <span className="font-medium text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                            </span>
                            <span className="text-gray-800">{value}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-700">Descripción:</h3>
                  <p className="mt-2 text-gray-600 leading-relaxed">{data?.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {data.category && (
        <div className="mt-12">
          <CategroyWiseProductDisplay category={data?.category} heading="Productos Recomendados" />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;