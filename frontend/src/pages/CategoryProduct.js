import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import productCategory from '../helpers/productCategory';
import VerticalCard from '../components/VerticalCard';
import SummaryApi from '../common';
import SpecificationAccordion from '../components/SpecificationAccordion';

const CategoryProduct = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    
    const urlSearch = new URLSearchParams(location.search);
    const selectedCategory = urlSearch.get("category") || "";
    const selectedSubcategory = urlSearch.get("subcategory") || "";

    const [filterCategoryList, setFilterCategoryList] = useState(selectedCategory ? [selectedCategory] : []);
    const [filterSubcategoryList, setFilterSubcategoryList] = useState(selectedSubcategory ? [selectedSubcategory] : []);
    const [filterBrands, setFilterBrands] = useState([]);
    const [specFilters, setSpecFilters] = useState({});
    const [availableFilters, setAvailableFilters] = useState({
        brands: [],
        specifications: {}
    });
    const [sortBy, setSortBy] = useState("");
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    // Mapeo de etiquetas para especificaciones
    const getSpecificationLabel = (specKey) => {
        const labels = {
            // Notebooks
            processor: "Procesador",
            memory: "Memoria RAM",
            storage: "Almacenamiento",
            disk: "Disco",
            graphicsCard: "Tarjeta Gráfica",
            notebookScreen: "Pantalla",
            notebookBattery: "Batería",
            pcCase: "Gabinete",
            pcPowerSupply: "Fuente de Poder",
            pcCooling: "Sistema de Enfriamiento",
            motherboardSocket: "Socket",
            motherboardChipset: "Chipset",
            motherboardFormFactor: "Factor de Forma",
            expansionSlots: "Slots de Expansión",
            ramType: "Tipo de RAM",
            ramSpeed: "Velocidad",
            ramCapacity: "Capacidad",
            ramLatency: "Latencia",
            hddCapacity: "Capacidad",
            diskType: "Tipo de Disco",
            hddInterface: "Interfaz",
            hddRPM: "RPM",
            diskReadSpeed: "Velocidad de Lectura",
            diskWriteSpeed: "Velocidad de Escritura",
            processorModel: "Modelo",
            processorSocket: "Socket",
            processorCores: "Núcleos",
            processorThreads: "Hilos",
            processorBaseFreq: "Frecuencia Base",
            processorTurboFreq: "Frecuencia Turbo",
            processorCache: "Caché",
            processorTDP: "TDP",
            psuWattage: "Vataje",
            psuEfficiency: "Eficiencia",
            psuModular: "Modularidad",
            psuFormFactor: "Factor de Forma",
            psuProtections: "Protecciones",
            monitorSize: "Tamaño",
            monitorResolution: "Resolución",
            monitorRefreshRate: "Tasa de Refresco",
            monitorPanel: "Tipo de Panel",
            monitorConnectivity: "Conectividad",
            keyboardInterface: "Interfaz",
            keyboardLayout: "Layout",
            keyboardBacklight: "Iluminación",
            keyboardSwitches: "Switches",
            keyboardFeatures: "Características",
            mouseInterface: "Interfaz",
            mouseSensor: "Sensor",
            mouseDPI: "DPI",
            mouseButtons: "Botones",
            mouseBacklight: "Iluminación",
            adapterType: "Tipo",
            adapterInterface: "Interfaz",
            adapterSpeed: "Velocidad",
            adapterProtocol: "Protocolo",
            cameraResolution: "Resolución",
            cameraLensType: "Tipo de Lente",
            cameraIRDistance: "Distancia IR",
            cameraType: "Tipo de Cámara",
            cameraConnectivity: "Conectividad",
            cameraProtection: "Protección",
            dvrChannels: "Canales",
            dvrResolution: "Resolución",
            dvrStorageCapacity: "Almacenamiento",
            dvrConnectivity: "Conectividad",
            dvrSmartFeatures: "Funciones Inteligentes",
            nasCapacity: "Capacidad",
            nasBays: "Bahías",
            nasRAID: "Soporte RAID",
            nasConnectivity: "Conectividad",
            printerType: "Tipo",
            printerResolution: "Resolución",
            printerSpeed: "Velocidad",
            printerDuplex: "Impresión Dúplex",
            printerConnectivity: "Conectividad",
            printerTrayCapacity: "Capacidad de Bandeja",
            printerFunctions: "Funciones",
            printerDisplay: "Display",
            upsCapacity: "Capacidad",
            upsOutputPower: "Potencia de Salida",
            upsBackupTime: "Tiempo de Respaldo",
            upsOutlets: "Tomas",
            upsType: "Tipo",
            upsConnectivity: "Conectividad",
            airpodsModel: "Modelo",
            airpodsBatteryLife: "Duración de Batería",
            airpodsCharging: "Tipo de Carga",
            airpodsResistance: "Resistencia",
            airpodsFeatures: "Características",
            softwareLicenseType: "Tipo de Licencia",
            softwareLicenseDuration: "Duración",
            softwareLicenseQuantity: "Cantidad de Usuarios",
            softwareVersion: "Versión",
            softwareFeatures: "Características",
            phoneType: "Tipo",
            phoneScreenSize: "Tamaño de Pantalla",
            phoneRAM: "RAM",
            phoneStorage: "Almacenamiento",
            phoneProcessor: "Procesador",
            phoneCameras: "Cámaras",
            phoneBattery: "Batería",
            phoneOS: "Sistema Operativo",
            landlineType: "Tipo",
            landlineTechnology: "Tecnología",
            landlineDisplay: "Pantalla",
            landlineFunctions: "Funciones",
            landlineHandsets: "Auriculares"
        };
        return labels[specKey] || specKey;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.filterProduct.url, {
                method: SummaryApi.filterProduct.method,
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    category: filterCategoryList,
                    subcategory: filterSubcategoryList,
                    brandName: filterBrands,
                    specifications: specFilters
                })
            });

            const dataResponse = await response.json();
            if (dataResponse.success) {
                setData(dataResponse.data || []);
                setAvailableFilters({
                    brands: dataResponse.filters.brands || [],
                    specifications: dataResponse.filters.specifications || {}
                });
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setFilterCategoryList(selectedCategory ? [selectedCategory] : []);
        setFilterSubcategoryList(selectedSubcategory ? [selectedSubcategory] : []);
        setSpecFilters({});
        setFilterBrands([]);
    }, [selectedCategory, selectedSubcategory]);

    useEffect(() => {
        fetchData();
    }, [filterCategoryList, filterSubcategoryList, filterBrands, specFilters]);

    const handleSelectCategory = (e) => {
        const category = e.target.value;
        navigate(`/categoria-producto?category=${category}`);
    };

    const handleSelectSubcategory = (subcategory) => {
        navigate(`/categoria-producto?category=${selectedCategory}&subcategory=${subcategory}`);
    };

    const handleSpecFilterChange = (type, value) => {
        setSpecFilters(prev => ({
            ...prev,
            [type]: prev[type]
                ? prev[type].includes(value)
                    ? prev[type].filter(item => item !== value)
                    : [...prev[type], value]
                : [value]
        }));
    };

    const handleOnChangeSortBy = (e) => {
        const { value } = e.target;
        setSortBy(value);

        setData(prev => [...prev].sort((a, b) => {
            const priceA = Number(a.sellingPrice) || 0;
            const priceB = Number(b.sellingPrice) || 0;
            return value === 'asc' ? priceA - priceB : priceB - priceA;
        }));
    };

    const renderSpecificationFilters = (isMobile = false) => {
        const specKeys = Object.keys(availableFilters.specifications);
        if (specKeys.length === 0) return null;

        return (
            <div className="mb-6">
                <h3 className={`text-base uppercase font-medium ${isMobile ? 'text-green-600 border-green-300' : 'text-slate-500 border-slate-300'} border-b pb-1 mb-3`}>
                    Especificaciones
                </h3>
                
                {specKeys.map(specKey => (
                    <SpecificationAccordion
                        key={specKey}
                        title={getSpecificationLabel(specKey)}
                        options={availableFilters.specifications[specKey] || []}
                        selectedValues={specFilters[specKey] || []}
                        onChange={(value) => handleSpecFilterChange(specKey, value)}
                        isMobile={isMobile}
                    />
                ))}
            </div>
        );
    };

    const renderFilters = (isMobile = false) => (
        <>
            {/* Sort by */}
            <div className="mb-6">
                <h3 className={`text-base uppercase font-medium ${isMobile ? 'text-green-600 border-green-300' : 'text-slate-500 border-slate-300'} border-b pb-1`}>
                    Ordenar por
                </h3>
                <form className='text-sm flex flex-col gap-2 py-2'>
                    <div className='flex items-center gap-3'>
                        <input
                            type='radio'
                            name='sortBy'
                            checked={sortBy === 'asc'}
                            onChange={handleOnChangeSortBy}
                            value="asc"
                            id={`${isMobile ? 'mobile-' : ''}sort-asc`}
                        />
                        <label htmlFor={`${isMobile ? 'mobile-' : ''}sort-asc`}>Precio - Bajo a Alto</label>
                    </div>
                    <div className='flex items-center gap-3'>
                        <input
                            type='radio'
                            name='sortBy'
                            checked={sortBy === 'dsc'}
                            onChange={handleOnChangeSortBy}
                            value="dsc"
                            id={`${isMobile ? 'mobile-' : ''}sort-dsc`}
                        />
                        <label htmlFor={`${isMobile ? 'mobile-' : ''}sort-dsc`}>Precio - Alto a Bajo</label>
                    </div>
                </form>
            </div>

            {/* Categories */}
            <div className="mb-6">
                <h3 className={`text-base uppercase font-medium ${isMobile ? 'text-green-600 border-green-300' : 'text-slate-500 border-slate-300'} border-b pb-1`}>
                    Categoría
                </h3>
                <form className='text-sm flex flex-col gap-2 py-2'>
                    {productCategory.map((category) => (
                        <div key={category.value} className={isMobile ? "mb-2" : ""}>
                            <div className='flex items-center gap-3'>
                                <input
                                    type='checkbox'
                                    name="category"
                                    checked={filterCategoryList.includes(category.value)}
                                    value={category.value}
                                    onChange={handleSelectCategory}
                                    id={`${isMobile ? 'mobile-' : ''}category-${category.value}`}
                                />
                                <label 
                                    htmlFor={`${isMobile ? 'mobile-' : ''}category-${category.value}`}
                                    className={isMobile ? "font-medium" : ""}
                                >
                                    {category.label}
                                </label>
                            </div>

                            {filterCategoryList.includes(category.value) && category.subcategories && (
                                <div className={`ml-${isMobile ? '6' : '4'} mt-2`}>
                                    {category.subcategories.map((subcat) => (
                                        <div className='flex items-center gap-3 mb-2' key={subcat.value}>
                                            <input
                                                type='checkbox'
                                                name="subcategory"
                                                checked={filterSubcategoryList.includes(subcat.value)}
                                                value={subcat.value}
                                                onChange={() => handleSelectSubcategory(subcat.value)}
                                                id={`${isMobile ? 'mobile-' : ''}subcategory-${subcat.value}`}
                                            />
                                            <label htmlFor={`${isMobile ? 'mobile-' : ''}subcategory-${subcat.value}`}>
                                                {subcat.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </form>
            </div>

            {/* Marcas */}
            {availableFilters.brands && availableFilters.brands.length > 0 && (
                <div className="mb-6">
                    <h3 className={`text-base uppercase font-medium ${isMobile ? 'text-green-600 border-green-300' : 'text-slate-500 border-slate-300'} border-b pb-1`}>
                        Marcas
                    </h3>
                    <form className='text-sm flex flex-col gap-2 py-2'>
                        {availableFilters.brands.map((brand) => (
                            <label key={brand} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filterBrands.includes(brand)}
                                    onChange={(e) => {
                                        const newBrands = e.target.checked
                                            ? [...filterBrands, brand]
                                            : filterBrands.filter(b => b !== brand);
                                        setFilterBrands(newBrands);
                                    }}
                                />
                                <span>{brand}</span>
                            </label>
                        ))}
                    </form>
                </div>
            )}

            {/* Especificaciones */}
            {renderSpecificationFilters(isMobile)}
        </>
    );

    return (
        <div className='container mx-auto p-4'>
            {/* Desktop version */}
            <div className='hidden lg:grid lg:grid-cols-[250px,1fr] lg:gap-4'>
                {/* Left side (filters) */}
                <div className='bg-white p-4 rounded-lg shadow min-h-[calc(100vh-120px)] overflow-y-auto'>
                    {renderFilters()}
                </div>

                {/* Right side (products) */}
                <div className='px-4'>
                    <p className='font-medium text-slate-800 text-lg mb-4'>
                        Resultados de la búsqueda: {data.length}
                    </p>
                    <div className='min-h-[calc(100vh-120px)] overflow-y-auto'>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <p>Cargando...</p>
                            </div>
                        ) : data.length > 0 ? (
                            <VerticalCard data={data} loading={loading} />
                        ) : (
                            <div className="flex justify-center items-center h-64">
                                <p>No se encontraron productos</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile version */}
            <div className="lg:hidden">
                <button
                    className="w-full text-center bg-green-600 text-white p-3 rounded-lg mb-4 hover:bg-green-700 transition-colors duration-300"
                    onClick={() => setIsFiltersVisible(prev => !prev)}
                >
                    {isFiltersVisible ? "Ocultar filtros" : "Mostrar filtros"}
                </button>

                {isFiltersVisible && (
                    <div className="bg-white p-4 rounded-lg shadow mb-4">
                        {renderFilters(true)}
                    </div>
                )}

                {/* Mobile Products */}
                <div className="px-4">
                    <p className='font-medium text-slate-800 text-lg mb-4'>
                        Resultados de la búsqueda: {data.length}
                    </p>
                    <div className='flex flex-wrap justify-center gap-4'>
                        {loading ? (
                            <div className="flex justify-center items-center w-full py-8">
                                <p>Cargando...</p>
                            </div>
                        ) : data.length > 0 ? (
                            <VerticalCard data={data} loading={loading} />
                        ) : (
                            <div className="flex justify-center items-center w-full py-8">
                                <p>No se encontraron productos</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryProduct;