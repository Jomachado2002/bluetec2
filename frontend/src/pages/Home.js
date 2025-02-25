import React from 'react';
import CategoryList from '../components/CategoryList';
import BannerProduct from '../components/BannerProduct';
import HorizontalCardProduct from '../components/HorizontalCardProduct';
import VerticalCardProduct from '../components/VerticalCardProduct';
import BrandCarousel from '../components/BrandCarousel';
import NotebookBanner from '../components/NotebookBanner';

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap');
          .font-atkinson {
            font-family: 'Atkinson Hyperlegible', sans-serif;
          }
        `}
      </style>

      {/* Hero Section with Categories and Banner */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto py-4">
          <CategoryList />
        </div>
        <div className="py-4">
          <BannerProduct />
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-12 py-8">
        {/* Notebooks Section */}
        <section className="container mx-auto px-4">
          <div className="relative">
            {/* Header with animated border */}
            <div className="flex items-center justify-between group">
              <h2 className="text-3xl font-bold text-green-800 font-atkinson relative">
                NOTEBOOKS
                <span className="absolute -bottom-2 left-0 w-0 h-1 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </h2>
              <div className="flex-1 h-[6px] bg-gradient-to-r from-green-600 to-green-400 ml-4 rounded-full"></div>
            </div>

            {/* Product Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
              {/* Featured Image */}
              <div className="lg:col-span-1">
                <div className="relative overflow-hidden rounded-xl shadow-lg group">
                <div className="lg:col-span-1">
                    <NotebookBanner />
                </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-lg font-bold">Notebooks Premium</p>
                      <p className="text-sm">Descubre nuestra selección</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Carousel */}
              <div className="lg:col-span-4">
                <HorizontalCardProduct
                  category="informatica"
                  subcategory="notebooks"
                  heading=""
                />
              </div>
            </div>
          </div>
        </section>

        {/* Promotional Banners */}
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer">
              <img
                src="/publicidad1.jpg"
                alt="Promoción 1"
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
                <div className="text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">Ofertas Especiales</h3>
                  <p className="text-sm">Descubre nuestras promociones exclusivas</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer">
              <img
                src="/publicidad2.jpg"
                alt="Promoción 2"
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
                <div className="text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">Nuevos Productos</h3>
                  <p className="text-sm">Conoce nuestras últimas novedades</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Sections */}
        {['PRODUCTOS DESTACADOS', 'IMPRESORAS', 'PERIFERICOS', 'TELEFONOS'].map((title) => (
          <section key={title} className="container mx-auto px-4">
            <div className="relative">
              <div className="flex items-center justify-between group mb-8">
                <h2 className="text-3xl font-bold text-green-800 font-atkinson relative">
                  {title}
                  <span className="absolute -bottom-2 left-0 w-0 h-1 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                </h2>
                <div className="flex-1 h-[6px] bg-gradient-to-r from-green-600 to-green-400 ml-4 rounded-full"></div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4">
                <VerticalCardProduct
                  category="informatica"
                  heading=""
                />
              </div>
            </div>
          </section>
        ))}

        {/* Brands Section */}
        <section className="container mx-auto px-4 bg-white py-8 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 font-atkinson relative group">
              MARCAS DESTACADAS
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gray-800 transition-all duration-300 group-hover:w-full"></span>
            </h2>
            <div className="flex-1 h-[6px] bg-gradient-to-r from-gray-800 to-gray-600 ml-4 rounded-full"></div>
          </div>
          <BrandCarousel />
        </section>
      </div>
    </div>
  );
};

export default Home;