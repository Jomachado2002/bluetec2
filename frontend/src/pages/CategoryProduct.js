import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import productCategory from '../helpers/productCategory';
import VerticalCard from '../components/VerticalCard';
import SummaryApi from '../common';
import { BiChevronDown, BiChevronUp, BiCheck, BiX, BiFilter, BiSort } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';
import { IoGridOutline, IoMenuOutline } from 'react-icons/io5';
import PriceFilterAccordion from '../components/PriceFilterAccordion';

const CategoryProduct = () => {
    const [rawData, setRawData] = useState([]);
    const [data, setData] = useState([]);       
    const [loading, setLoading] = useState(false);
    const [gridView, setGridView] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    
    const urlSearch = new URLSearchParams(location.search);
    const selectedCategory = urlSearch.get("category") || "";
    const selectedSubcategory = urlSearch.get("subcategory") || "";

    // Estados para los filtros
    const [filterCategoryList, setFilterCategoryList] = useState(selectedCategory ? [selectedCategory] : []);
    const [filterSubcategoryList, setFilterSubcategoryList] = useState(selectedSubcategory ? [selectedSubcategory] : []);
    const [filterBrands, setFilterBrands] = useState([]);
    const [specFilters, setSpecFilters] = useState({});
    const [availableFilters, setAvailableFilters] = useState({
        brands: [],
        specifications: {}
    });
    const [sortBy, setSortBy] = useState("");
    const [searchBrand, setSearchBrand] = useState('');
    const [searchSpecification, setSearchSpecification] = useState('');

    // Para el filtro de precio (solo para móvil)
    const [tempPriceRange, setTempPriceRange] = useState({ min: '', max: '' });
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    // Estados de UI
    const [activeMobileFilter, setActiveMobileFilter] = useState('categories');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [filterCount, setFilterCount] = useState(0);
    const [activeAccordions, setActiveAccordions] = useState({
        sort: true,
        categories: true,
        brands: true
    });
    const mobileFilterRef = useRef(null);
    const prevLocationRef = useRef(location.search);

    // Cerrar el filtro móvil al tocar fuera o con la tecla Escape
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileFilterRef.current && !mobileFilterRef.current.contains(event.target)) {
                setMobileFilterOpen(false);
            }
        };
        
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setMobileFilterOpen(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    // Cargar datos iniciales
    useEffect(() => {
        if (selectedCategory) {
            setFilterCategoryList([selectedCategory]);
        }
        
        if (selectedSubcategory) {
            setFilterSubcategoryList([selectedSubcategory]);
            // Buscar y establecer la categoría padre
            findParentCategory(selectedSubcategory);
        }
        
        fetchData();
    }, []);

    // Reaccionar a cambios en la URL
    useEffect(() => {
        if (location.search !== prevLocationRef.current) {
            const newUrlSearch = new URLSearchParams(location.search);
            const newCategory = newUrlSearch.get("category") || "";
            const newSubcategory = newUrlSearch.get("subcategory") || "";
            
            setFilterCategoryList(newCategory ? [newCategory] : []);
            setFilterSubcategoryList(newSubcategory ? [newSubcategory] : []);
            
            if (newSubcategory) {
                findParentCategory(newSubcategory);
            }
            
            // Limpiar otros filtros al cambiar de página
            setFilterBrands([]);
            setSpecFilters({});
            setPriceRange({ min: '', max: '' });
            setTempPriceRange({ min: '', max: '' });
            
            fetchData();
            prevLocationRef.current = location.search;
        }
    }, [location.search]);

    // Función para encontrar la categoría padre de una subcategoría
    const findParentCategory = (subcategory) => {
        for (const category of productCategory) {
            if (category.subcategories) {
                const found = category.subcategories.find(sub => sub.value === subcategory);
                if (found) {
                    setFilterCategoryList([category.value]);
                    break;
                }
            }
        }
    };

    // Contar todos los filtros aplicados
    useEffect(() => {
        let count = filterCategoryList.length + filterSubcategoryList.length + filterBrands.length;
        
        // Contar filtros de especificaciones
        Object.values(specFilters).forEach(values => {
            count += values.length;
        });
        
        // Contar filtro de rango de precio
        if (priceRange.min || priceRange.max) {
            count += 1;
        }
        
        setFilterCount(count);
    }, [filterCategoryList, filterSubcategoryList, filterBrands, specFilters, priceRange]);

    // Ajustar overflow del body cuando se abre el modal de filtros
    useEffect(() => {
        if (mobileFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileFilterOpen]);

    // Inicializar el precio temporal cuando cambia el precio real
    useEffect(() => {
        setTempPriceRange(priceRange);
    }, [priceRange]);

    // Cargar datos cuando cambian los filtros
    useEffect(() => {
        fetchData();
    }, [filterCategoryList, filterSubcategoryList, filterBrands, specFilters]);

    // Aplicar ordenamiento y filtro de precio a los datos
    useEffect(() => {
        if (rawData.length > 0) {
            let sortedData = [...rawData];
            
            if (sortBy) {
                sortedData.sort((a, b) => {
                    const priceA = Number(a.sellingPrice) || 0;
                    const priceB = Number(b.sellingPrice) || 0;
                    return sortBy === 'asc' ? priceA - priceB : priceB - priceA;
                });
            }
            
            // Aplicar filtro de rango de precio
            if (priceRange.min || priceRange.max) {
                sortedData = sortedData.filter(item => {
                    const price = Number(item.sellingPrice) || 0;
                    const minOk = priceRange.min ? price >= Number(priceRange.min) : true;
                    const maxOk = priceRange.max ? price <= Number(priceRange.max) : true;
                    return minOk && maxOk;
                });
            }
            
            setData(sortedData);
        } else {
            setData([]);
        }
    }, [rawData, sortBy, priceRange]);

    // Añadir metadatos de SEO
    useEffect(() => {
        // Cambiar el título del documento para SEO
        const seoTitle = getSeoTitle();
        document.title = `${seoTitle} | JM Computer`;
        
        // Actualizar meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', `Compra online ${seoTitle.toLowerCase()} con garantía oficial. Envío a todo Paraguay. Precios competitivos y atención personalizada.`);
        }
        
        // Meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            let keywords = `${seoTitle}, JM Computer, tecnología Paraguay`;
            
            if (selectedSubcategory) {
                keywords += `, ${selectedSubcategory} Paraguay`;
            }
            
            if (selectedCategory) {
                keywords += `, ${selectedCategory} Paraguay`;
            }
            
            metaKeywords.setAttribute('content', keywords);
        }
    }, [selectedCategory, selectedSubcategory]);

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
                setRawData(dataResponse.data || []);
                
                // Guardar filtros disponibles
                const newFilters = {
                    brands: dataResponse.filters?.brands || [],
                    specifications: dataResponse.filters?.specifications || {}
                };
                
                setAvailableFilters(newFilters);
                
                // Preestablecer los acordeones de especificaciones
                if (dataResponse.filters?.specifications) {
                    const specKeys = Object.keys(dataResponse.filters.specifications);
                    const newAccordions = { ...activeAccordions };
                    
                    // Abrir solo las primeras 3 especificaciones por defecto
                    specKeys.slice(0, 3).forEach(key => {
                        newAccordions[`spec-${key}`] = true;
                    });
                    
                    setActiveAccordions(newAccordions);
                }
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
            setRawData([]);
        } finally {
            setLoading(false);
        }
    };

    // Función para aplicar el filtro de precio solo cuando se presiona el botón
    const applyPriceFilter = () => {
        setPriceRange(tempPriceRange);
    };

    // Función para manejar cambios en el campo de precio
    const handlePriceChange = (field, value) => {
        // Solo permite números
        const numericValue = value.replace(/[^0-9]/g, '');
        setTempPriceRange(prev => ({
            ...prev,
            [field]: numericValue
        }));
    };

    // Funciones para manipular filtros
    const handleSelectCategory = (category) => {
        // Si ya está seleccionada, la deseleccionamos
        if (filterCategoryList.includes(category)) {
            setFilterCategoryList([]);
            
            // También limpiamos la subcategoría si pertenece a esta categoría
            const categoryObj = productCategory.find(c => c.value === category);
            if (categoryObj && categoryObj.subcategories) {
                const subcategoryValues = categoryObj.subcategories.map(sub => sub.value);
                if (subcategoryValues.some(sub => filterSubcategoryList.includes(sub))) {
                    setFilterSubcategoryList([]);
                }
            }
        } else {
            // Seleccionar esta categoría (solo una a la vez)
            setFilterCategoryList([category]);
            
            // Limpiar subcategorías si no son de esta categoría
            const categoryObj = productCategory.find(c => c.value === category);
            if (categoryObj && categoryObj.subcategories) {
                const subcategoryValues = categoryObj.subcategories.map(sub => sub.value);
                const validSubcats = filterSubcategoryList.filter(sub => 
                    subcategoryValues.includes(sub)
                );
                setFilterSubcategoryList(validSubcats);
            } else {
                setFilterSubcategoryList([]);
            }
        }
    };

    const handleSelectSubcategory = (subcategory) => {
        // Si ya está seleccionada, la deseleccionamos
        if (filterSubcategoryList.includes(subcategory)) {
            setFilterSubcategoryList([]);
        } else {
            // Seleccionar esta subcategoría (solo una a la vez)
            setFilterSubcategoryList([subcategory]);
            
            // Seleccionar automáticamente la categoría padre
            findParentCategory(subcategory);
        }
        
        // Actualizar URL para reflejar la subcategoría
        navigate(`/categoria-producto?subcategory=${subcategory}`);
    };
    
    // Permitir seleccionar múltiples especificaciones del mismo tipo
    const handleSpecFilterChange = (type, value) => {
        setSpecFilters(prev => {
            const newFilters = { ...prev };
            
            // Si el tipo ya existe
            if (newFilters[type]) {
                // Si el valor ya está seleccionado, quitarlo
                if (newFilters[type].includes(value)) {
                    newFilters[type] = newFilters[type].filter(v => v !== value);
                    
                    // Si el array queda vacío, eliminar la propiedad
                    if (newFilters[type].length === 0) {
                        delete newFilters[type];
                    }
                } 
                // Si no está seleccionado, añadirlo
                else {
                    newFilters[type] = [...newFilters[type], value];
                }
            } 
            // Si el tipo no existe, crearlo con el primer valor
            else {
                newFilters[type] = [value];
            }
            
            return newFilters;
        });
    };

    const clearAllFilters = () => {
        setFilterCategoryList(selectedCategory ? [selectedCategory] : []);
        setFilterSubcategoryList(selectedSubcategory ? [selectedSubcategory] : []);
        setFilterBrands([]);
        setSpecFilters({});
        setPriceRange({ min: '', max: '' });
        setTempPriceRange({ min: '', max: '' });
        setSortBy('');
    };

    const toggleAccordion = (id) => {
        setActiveAccordions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Funciones auxiliares
    const getSeoTitle = () => {
        if (selectedSubcategory === "notebooks") 
            return "Las mejores notebooks para estudiantes y profesionales en Paraguay";
        if (selectedSubcategory === "placasMadre") 
            return "Placas madre de alto rendimiento para gaming y diseño";
        if (selectedSubcategory === "procesador") 
            return "Procesadores de última generación al mejor precio en Paraguay";
        if (selectedSubcategory === "graficas") 
            return "Tarjetas gráficas para gaming y diseño profesional en Paraguay";
        if (selectedSubcategory === "monitores") 
            return "Monitores de alta resolución para productividad y gaming";
        if (selectedSubcategory === "almacenamiento") 
            return "Discos duros y SSDs con la mejor relación precio-rendimiento";
            
        if (selectedCategory) {
            const category = productCategory.find(c => c.value === selectedCategory);
            return category ? `${category.label} de calidad al mejor precio en Paraguay` : 'Productos';
        }
            
        if (selectedSubcategory) {
            let subcategoryLabel;
            productCategory.forEach(cat => {
                const foundSub = cat.subcategories?.find(s => s.value === selectedSubcategory);
                if (foundSub) subcategoryLabel = foundSub.label;
            });
            return subcategoryLabel ? `${subcategoryLabel} con envío gratis y garantía oficial` : 'Productos';
        }
            
        return 'Equipos de tecnología al mejor precio en Paraguay';
    };

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

            // Computadoras Ensambladas
            pcCase: "Gabinete",
            pcPowerSupply: "Fuente de Poder",
            pcCooling: "Sistema de Enfriamiento",

            // Placas Madre
            motherboardSocket: "Socket",
            motherboardChipset: "Chipset",
            motherboardFormFactor: "Factor de Forma",
            expansionSlots: "Slots de Expansión",

            // Memorias RAM
            ramType: "Tipo de RAM",
            ramSpeed: "Velocidad",
            ramCapacity: "Capacidad",
            ramLatency: "Latencia",

            // Discos Duros
            hddCapacity: "Capacidad",
            diskType: "Tipo de Disco",
            hddInterface: "Interfaz",
            hddRPM: "RPM",
            diskReadSpeed: "Velocidad de Lectura",
            diskWriteSpeed: "Velocidad de Escritura",

            // Procesadores
            processorModel: "Modelo",
            processorSocket: "Socket",
            processorCores: "Núcleos",
            processorThreads: "Hilos",
            processorBaseFreq: "Frecuencia Base",
            processorTurboFreq: "Frecuencia Turbo",
            processorCache: "Caché",
            processorTDP: "TDP",
            processorIntegratedGraphics: "Gráficos Integrados",
            processorManufacturingTech: "Tecnología de Fabricación",

            // Tarjetas Gráficas
            graphicCardModel: "Modelo",
            graphicCardMemory: "Memoria",
            graphicCardMemoryType: "Tipo de Memoria",
            graphicCardBaseFrequency: "Frecuencia Base",
            graphicfabricate: "Fabricante",
            graphicCardTDP: "Consumo (TDP)",

            // Gabinetes
            caseFormFactor: "Factor de Forma",
            caseMaterial: "Material",
            caseExpansionBays: "Bahías de Expansión",
            caseIncludedFans: "Ventiladores Incluidos",
            caseCoolingSupport: "Soporte de Refrigeración",
            caseBacklight: "Iluminación",

            // Fuentes de Alimentación
            psuWattage: "Vataje",
            psuEfficiency: "Eficiencia",
            psuModular: "Modularidad",
            psuFormFactor: "Factor de Forma",
            psuProtections: "Protecciones",

            // Monitores
            monitorSize: "Tamaño",
            monitorResolution: "Resolución",
            monitorRefreshRate: "Tasa de Refresco",
            monitorPanel: "Tipo de Panel",
            monitorConnectivity: "Conectividad",

            // Teclados
            keyboardInterface: "Interfaz",
            keyboardLayout: "Layout",
            keyboardBacklight: "Iluminación",
            keyboardSwitches: "Switches",
            keyboardFeatures: "Características",

            // Mouses
            mouseInterface: "Interfaz",
            mouseSensor: "Sensor",
            mouseDPI: "DPI",
            mouseButtons: "Botones",
            mouseBacklight: "Iluminación",

            // Adaptadores
            adapterType: "Tipo",
            adapterInterface: "Interfaz",
            adapterSpeed: "Velocidad",
            adapterProtocol: "Protocolo",

            // Auriculares
            headphoneConnectionType: "Tipo de Conexión",
            headphoneTechnology: "Tecnología de Conexión",
            headphoneFrequencyResponse: "Respuesta de Frecuencia",
            headphoneImpedance: "Impedancia",
            headphoneNoiseCancel: "Cancelación de Ruido",
            headphoneBatteryLife: "Duración de Batería",

            // Micrófonos
            microphoneType: "Tipo de Micrófono",
            microphonePolarPattern: "Patrón Polar",
            microphoneFrequencyRange: "Rango de Frecuencia",
            microphoneConnection: "Conexión",
            microphoneSpecialFeatures: "Características Especiales",

            // Cámaras de Seguridad
            cameraResolution: "Resolución",
            cameraLensType: "Tipo de Lente",
            cameraIRDistance: "Distancia IR",
            cameraType: "Tipo de Cámara",
            cameraConnectivity: "Conectividad",
            cameraProtection: "Protección",

            // DVR
            dvrChannels: "Canales",
            dvrResolution: "Resolución",
            dvrStorageCapacity: "Almacenamiento",
            dvrConnectivity: "Conectividad",
            dvrSmartFeatures: "Funciones Inteligentes",

            // NAS
            nasMaxCapacity: "Capacidad Máxima",
            nasBaysNumber: "Número de Bahías",
            nasProcessor: "Procesador",
            nasRAM: "Memoria RAM",
            nasRAIDSupport: "Tipos de RAID Soportados",
            nasConnectivity: "Conectividad",
            nasCapacity: "Capacidad",
            nasBays: "Bahías",
            nasRAID: "Soporte RAID",

            // Impresoras
            printerType: "Tipo",
            printerResolution: "Resolución",
            printerSpeed: "Velocidad",
            printerDuplex: "Impresión Dúplex",
            printerConnectivity: "Conectividad",
            printerTrayCapacity: "Capacidad de Bandeja",
            printerFunctions: "Funciones",
            printerDisplay: "Display",

            // Cartuchos/Toner
            tonerPrinterType: "Tipo de Impresora",
            tonerColor: "Color",
            tonerYield: "Rendimiento",
            tonerCartridgeType: "Tipo de Cartucho",
            tonerCompatibleModel: "Modelo Compatible",

            // UPS
            upsCapacity: "Capacidad",
            upsOutputPower: "Potencia de Salida",
            upsBackupTime: "Tiempo de Respaldo",
            upsOutlets: "Tomas",
            upsType: "Tipo",
            upsConnectivity: "Conectividad",

            // Accesorios
            airpodsModel: "Modelo",
            airpodsBatteryLife: "Duración de Batería",
            airpodsCharging: "Tipo de Carga",
            airpodsResistance: "Resistencia",
            airpodsFeatures: "Características",

            // Software y Licencias
            softwareLicenseType: "Tipo de Licencia",
            softwareLicenseDuration: "Duración",
            softwareLicenseQuantity: "Cantidad de Usuarios",
            softwareVersion: "Versión",
            softwareFeatures: "Características",

            // Telefonía - Móviles
            phoneType: "Tipo",
            phoneScreenSize: "Tamaño de Pantalla",
            phoneRAM: "RAM",
            phoneStorage: "Almacenamiento",
            phoneProcessor: "Procesador",
            phoneCameras: "Cámaras",
            phoneBattery: "Batería",
            phoneOS: "Sistema Operativo",

            // Telefonía - Fijos
            landlineType: "Tipo",
            landlineTechnology: "Tecnología",
            landlineDisplay: "Pantalla",
            landlineFunctions: "Funciones",
            landlineHandsets: "Auriculares",

            // Telefonía - Tablets
            tabletScreenSize: "Tamaño de Pantalla",
            tabletScreenResolution: "Resolución de Pantalla",
            tabletProcessor: "Procesador",
            tabletRAM: "Memoria RAM",
            tabletStorage: "Almacenamiento",
            tabletOS: "Sistema Operativo",
            tabletConnectivity: "Conectividad",

            // Redes - Switch
            switchType: "Tipo de Switch",
            switchPorts: "Número de Puertos",
            switchPortSpeed: "Velocidad de Puertos",
            switchNetworkLayer: "Capa de Red",
            switchCapacity: "Capacidad de Conmutación",

            // Redes - Servidores
            serverType: "Tipo de Servidor",
            serverProcessor: "Procesador",
            serverProcessorCount: "Número de Procesadores",
            serverRAM: "Memoria RAM",
            serverStorage: "Almacenamiento",
            serverOS: "Sistema Operativo",

            // Redes - Cables
            networkCableType: "Tipo de Cable",
            networkCableCategory: "Categoría",
            networkCableLength: "Longitud",
            networkCableShielding: "Blindaje",
            networkCableRecommendedUse: "Uso Recomendado",

            // Redes - Racks
            rackType: "Tipo de Rack",
            rackUnits: "Unidades de Rack (U)",
            rackDepth: "Profundidad",
            rackMaterial: "Material",
            rackLoadCapacity: "Capacidad de Carga",

            // Redes - Access Point
            apWiFiStandard: "Estándar WiFi",
            apSupportedBands: "Bandas Soportadas",
            apMaxSpeed: "Velocidad Máxima",
            apPorts: "Puertos",
            apAntennas: "Antenas",

            // Periféricos - Otros
            operatingSystem: "Sistema Operativo"
        };
        
        return labels[specKey] || specKey;
    };

    const hasActiveFilters = () => {
        return filterCount > 0;
    };
    
    const filteredBrands = useMemo(() => {
        return availableFilters.brands.filter(brand => 
            brand.toLowerCase().includes(searchBrand.toLowerCase())
        );
    }, [availableFilters.brands, searchBrand]);

    // Componentes de UI
    const FilterChip = ({ label, onRemove }) => (
        <div className="inline-flex items-center bg-green-100 rounded-full px-3 py-1 text-sm text-green-800 mr-2 mb-2 border border-green-200 shadow-sm">
            <span className="mr-1 font-medium">{label}</span>
            <button 
                onClick={onRemove} 
                className="text-green-700 hover:text-green-900 hover:bg-green-200 rounded-full p-0.5"
                aria-label={`Eliminar filtro ${label}`}
            >
                <BiX className="text-lg" />
            </button>
        </div>
    );

    const FilterCheckbox = ({ label, checked, onChange, count, bold }) => (
        <label className="flex items-center py-2 px-2 rounded hover:bg-gray-100 cursor-pointer group transition-colors">
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                    checked={checked}
                    onChange={onChange}
                />
                {checked && (
                    <BiCheck className="absolute text-white pointer-events-none" style={{ left: '2px' }} />
                )}
            </div>
            <span className={`ml-2 text-sm ${bold ? 'font-medium text-gray-800' : 'text-gray-700'} group-hover:text-gray-900`}>{label}</span>
            {count !== undefined && (
                <span className="ml-auto text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full">{count}</span>
            )}
        </label>
    );

    const FilterAccordion = ({ title, id, icon, children, count }) => {
        const isActive = activeAccordions[id];
        
        return (
            <div className="border-b border-gray-200 py-2">
                <button 
                    className="w-full flex items-center justify-between py-3 px-2 text-left focus:outline-none hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => toggleAccordion(id)}
                    aria-expanded={isActive}
                    aria-controls={`accordion-content-${id}`}
                >
                    <div className="flex items-center">
                        {icon && <span className="mr-2 text-gray-500">{icon}</span>}
                        <span className="font-semibold text-gray-800">{title}</span>
                        {count > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                {count}
                            </span>
                        )}
                    </div>
                    <span className="text-gray-500">
                        {isActive ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
                    </span>
                </button>
                {isActive && (
                    <div 
                        id={`accordion-content-${id}`}
                        className="py-2 pl-2 pr-1 bg-gray-50 rounded-md mt-1 mb-2"
                    >
                        {children}
                    </div>
                )}
            </div>
        );
    };

    const SpecificationFilter = ({ title, specKey, options }) => {
        const [searchValue, setSearchValue] = useState('');
        const filteredOptions = options.filter(option => 
            String(option).toLowerCase().includes(searchValue.toLowerCase())
        );
        
        const selectedValues = specFilters[specKey] || [];
        const isActive = activeAccordions[`spec-${specKey}`];
        
        return (
            <div className="border-b border-gray-200 py-2">
                <button 
                    className="w-full flex items-center justify-between py-3 px-2 text-left focus:outline-none hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => toggleAccordion(`spec-${specKey}`)}
                    aria-expanded={isActive}
                    aria-controls={`spec-content-${specKey}`}
                >
                    <div className="flex items-center">
                        <span className="font-semibold text-gray-800">{title}</span>
                        {selectedValues.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                {selectedValues.length}
                            </span>
                        )}
                    </div>
                    <span className="text-gray-500">
                        {isActive ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
                    </span>
                </button>
                
                {isActive && (
                    <div 
                        id={`spec-content-${specKey}`}
                        className="py-2 pl-2 pr-1 bg-gray-50 rounded-md mt-1 mb-2"
                    >
                        <div className="relative mb-2">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
                        </div>
                        
                        <div className="max-h-48 overflow-y-auto px-1 border border-gray-200 rounded bg-white">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(option => (
                                    <FilterCheckbox
                                        key={`${specKey}-${option}`}
                                        label={option}
                                        checked={selectedValues.includes(option)}
                                        onChange={() => handleSpecFilterChange(specKey, option)}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 py-3 text-center">No se encontraron resultados</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Render de filtros activos
    const renderActiveFilters = () => {
        if (!hasActiveFilters()) return null;

        return (
            <div className="mb-4 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-800">Filtros activos</h3>
                    <button 
                        onClick={clearAllFilters}
                        className="text-xs text-green-600 hover:text-green-800 hover:underline font-medium"
                    >
                        Limpiar todos
                    </button>
                </div>
                <div className="flex flex-wrap">
                    {filterCategoryList.map(cat => {
                        const category = productCategory.find(c => c.value === cat);
                        return (
                            <FilterChip 
                                key={`cat-${cat}`} 
                                label={`Categoría: ${category?.label || cat}`} 
                                onRemove={() => handleSelectCategory(cat)} 
                            />
                        );
                    })}
                    
                    {filterSubcategoryList.map(sub => {
                        // Buscar el nombre de la subcategoría
                        let subcategoryLabel = sub;
                        productCategory.forEach(cat => {
                            const foundSub = cat.subcategories?.find(s => s.value === sub);
                            if (foundSub) subcategoryLabel = foundSub.label;
                        });
                        return (
                            <FilterChip 
                                key={`sub-${sub}`} 
                                label={`Subcategoría: ${subcategoryLabel}`} 
                                onRemove={() => handleSelectSubcategory(sub)} 
                            />
                        );
                    })}
                    
                    {filterBrands.map(brand => (
                        <FilterChip 
                            key={`brand-${brand}`} 
                            label={`Marca: ${brand}`} 
                            onRemove={() => setFilterBrands(prev => prev.filter(b => b !== brand))} 
                        />
                    ))}
                    
                    {Object.entries(specFilters).map(([specKey, values]) => 
                        values.map(value => (
                            <FilterChip 
                                key={`spec-${specKey}-${value}`} 
                                label={`${getSpecificationLabel(specKey)}: ${value}`} 
                                onRemove={() => handleSpecFilterChange(specKey, value)} 
                            />
                        ))
                    )}
                    
                    {(priceRange.min || priceRange.max) && (
                        <FilterChip 
                            label={`Precio: ${priceRange.min || '0'} - ${priceRange.max || '∞'}`} 
                            onRemove={() => setPriceRange({ min: '', max: '' })} 
                        />
                    )}
                </div>
            </div>
        );
    };

    // Render de filtros de escritorio
    const renderDesktopFilters = () => (
        <div className="space-y-1">
            <div className="bg-gray-50 p-4 mb-4 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Filtros</h2>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        {data.length} {data.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                    </p>
                    {hasActiveFilters() && (
                        <button 
                            onClick={clearAllFilters}
                            className="text-xs text-green-600 hover:text-green-800 hover:underline font-medium"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            </div>
                    {/* Precio */}

                <PriceFilterAccordion
                currentPriceRange={priceRange}
                onApplyPriceFilter={(range) => setPriceRange(range)}
                />
            {/* Ordenar por */}
            <FilterAccordion
                id="sort"
                title="Ordenar por"
                icon={<BiSort />}
                count={sortBy ? 1 : 0}
            >
                <div className="px-1">
                    <label className="flex items-center py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer transition-colors">
                        <input
                            type="radio"
                            name="sortBy"
                            value="asc"
                            checked={sortBy === 'asc'}
                            onChange={() => setSortBy('asc')}
                            className="text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Precio: Menor a mayor</span>
                    </label>
                    <label className="flex items-center py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer transition-colors">
                        <input
                            type="radio"
                            name="sortBy"
                            value="dsc"
                            checked={sortBy === 'dsc'}
                            onChange={() => setSortBy('dsc')}
                            className="text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Precio: Mayor a menor</span>
                    </label>
                </div>
            </FilterAccordion>

            {/* Categorías */}
            <FilterAccordion
                id="categories"
                title="Categorías"
                count={filterCategoryList.length}
            >
                <div className="px-1 max-h-60 overflow-y-auto">
                    {productCategory.map((category) => (
                        <div key={category.value} className="mb-2">
                            <FilterCheckbox
                                label={category.label}
                                checked={filterCategoryList.includes(category.value)}
                                onChange={() => handleSelectCategory(category.value)}
                                bold={true}
                            />
                            
                            {filterCategoryList.includes(category.value) && category.subcategories && (
                                <div className="ml-6 mt-1 space-y-1 border-l-2 border-green-200 pl-2">
                                    {category.subcategories.map((subcat) => (
                                        <FilterCheckbox
                                            key={subcat.value}
                                            label={subcat.label}
                                            checked={filterSubcategoryList.includes(subcat.value)}
                                            onChange={() => handleSelectSubcategory(subcat.value)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </FilterAccordion>

            {/* Marcas */}
            {availableFilters.brands && availableFilters.brands.length > 0 && (
                <FilterAccordion
                    id="brands"
                    title="Marcas"
                    count={filterBrands.length}
                >
                    <div className="px-1">
                        <div className="relative mb-2">
                            <input
                                type="text"
                                placeholder="Buscar marca..."
                                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={searchBrand}
                                onChange={(e) => setSearchBrand(e.target.value)}
                            />
                            <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
                        </div>
                        
                        <div className="max-h-48 overflow-y-auto border border-gray-200 rounded bg-white">
                            {filteredBrands.length > 0 ? (
                                filteredBrands.map((brand) => (
                                    <FilterCheckbox
                                        key={brand}
                                        label={brand}
                                        checked={filterBrands.includes(brand)}
                                        onChange={() => {
                                            const newBrands = filterBrands.includes(brand)
                                                ? filterBrands.filter(b => b !== brand)
                                                : [...filterBrands, brand];
                                            setFilterBrands(newBrands);
                                        }}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 py-3 text-center">No se encontraron marcas</p>
                            )}
                        </div>
                    </div>
                </FilterAccordion>
            )}
            
            {/* Especificaciones */}
            <div className="mt-4">
                <h3 className="text-md font-semibold text-gray-800 mb-2 border-b pb-2">Especificaciones</h3>
                {Object.keys(availableFilters.specifications).map(specKey => (
                    <SpecificationFilter
                        key={specKey}
                        title={getSpecificationLabel(specKey)}
                        specKey={specKey}
                        options={availableFilters.specifications[specKey] || []}
                    />
                ))}
                {Object.keys(availableFilters.specifications).length === 0 && (
                    <p className="text-sm text-gray-500 py-2 text-center italic">
                        Selecciona una categoría para ver las especificaciones disponibles
                    </p>
                )}
            </div>
        </div>
    );

    // Render de filtros móviles
    // Render de filtros móviles
const renderMobileFilterPanel = () => (
    <div 
        className={`fixed inset-0 z-50 ${mobileFilterOpen ? 'block' : 'hidden'}`}
    >
        {/* Overlay para cerrar al tocar fuera del panel */}
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileFilterOpen(false)} />
        
        {/* Panel de filtro - modificado para ocupar solo parte de la pantalla */}
        <div 
            ref={mobileFilterRef}
            className="absolute right-0 top-0 h-full w-4/5 max-w-md bg-white shadow-xl flex flex-col"
        >
            {/* Cabecera del filtro con botón de cerrar más grande y visible */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Filtros</h2>
                <button 
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                    aria-label="Cerrar filtros"
                >
                    <BiX size={28} />
                </button>
            </div>
                
                {/* Botones de categorías de filtro */}
                <div className="flex-shrink-0 p-4 border-b overflow-x-auto">
                    <div className="flex flex-nowrap space-x-2">
                        <button 
                            onClick={() => setActiveMobileFilter('categories')}
                            className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium ${
                                activeMobileFilter === 'categories' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            Categorías
                            {(filterCategoryList.length || filterSubcategoryList.length) > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 bg-white text-green-800 text-xs rounded-full">
                                    {filterCategoryList.length + filterSubcategoryList.length}
                                </span>
                            )}
                        </button>
                        
                        <button 
                            onClick={() => setActiveMobileFilter('price')}
                            className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium ${
                                activeMobileFilter === 'price' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            Precio
                            {(priceRange.min || priceRange.max) && (
                                <span className="ml-1 px-1.5 py-0.5 bg-white text-green-800 text-xs rounded-full">
                                    1
                                </span>
                            )}
                        </button>
                        
                        <button 
                            onClick={() => setActiveMobileFilter('brands')}
                            className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium ${
                                activeMobileFilter === 'brands' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            Marcas
                            {filterBrands.length > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 bg-white text-green-800 text-xs rounded-full">
                                    {filterBrands.length}
                                </span>
                            )}
                        </button>
                        
                        <button 
                            onClick={() => setActiveMobileFilter('specs')}
                            className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium ${
                                activeMobileFilter === 'specs' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            Especificaciones
                            {Object.values(specFilters).flat().length > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 bg-white text-green-800 text-xs rounded-full">
                                    {Object.values(specFilters).flat().length}
                                </span>
                            )}
                        </button>
                        
                        <button 
                            onClick={() => setActiveMobileFilter('sort')}
                            className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium ${
                                activeMobileFilter === 'sort' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            Ordenar
                            {sortBy && (
                                <span className="ml-1 px-1.5 py-0.5 bg-white text-green-800 text-xs rounded-full">
                                    1
                                </span>
                            )}
                        </button>
                    </div>
                </div>
                
                {/* Contenido del filtro con scroll independiente */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {activeMobileFilter === 'categories' && (
                        <div>
                            <h3 className="text-lg font-medium mb-3">Categorías</h3>
                            <div className="space-y-2">
                                {productCategory.map((category) => (
                                    <div key={category.value} className="mb-3">
                                        <FilterCheckbox
                                            label={category.label}
                                            checked={filterCategoryList.includes(category.value)}
                                            onChange={() => handleSelectCategory(category.value)}
                                            bold={true}
                                        />
                                        
                                        {filterCategoryList.includes(category.value) && category.subcategories && (
                                            <div className="ml-6 mt-2 space-y-2 border-l-2 border-green-200 pl-2">
                                                {category.subcategories.map((subcat) => (
                                                    <FilterCheckbox
                                                        key={subcat.value}
                                                        label={subcat.label}
                                                        checked={filterSubcategoryList.includes(subcat.value)}
                                                        onChange={() => handleSelectSubcategory(subcat.value)}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {activeMobileFilter === 'price' && (
                        <div>
                            <h3 className="text-lg font-medium mb-3">Rango de Precio</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="mobile-min-price" className="block text-sm text-gray-600 mb-1">Precio mínimo</label>
                                    <input
                                        id="mobile-min-price"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="Mínimo"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        value={tempPriceRange.min}
                                        onChange={(e) => handlePriceChange('min', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="mobile-max-price" className="block text-sm text-gray-600 mb-1">Precio máximo</label>
                                    <input
                                        id="mobile-max-price"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="Máximo"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        value={tempPriceRange.max}
                                        onChange={(e) => handlePriceChange('max', e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                                        onClick={applyPriceFilter}
                                    >
                                        Aplicar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeMobileFilter === 'brands' && (
                        <div>
                            <h3 className="text-lg font-medium mb-3">Marcas</h3>
                            <div className="relative mb-3">
                                <input
                                    type="text"
                                    placeholder="Buscar marca..."
                                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md"
                                    value={searchBrand}
                                    onChange={(e) => setSearchBrand(e.target.value)}
                                />
                                <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
                            </div>
                            
                            <div className="space-y-2 border border-gray-200 rounded p-2 max-h-[60vh] overflow-y-auto bg-white">
                                {filteredBrands.length > 0 ? (
                                    filteredBrands.map((brand) => (
                                        <FilterCheckbox
                                            key={brand}
                                            label={brand}
                                            checked={filterBrands.includes(brand)}
                                            onChange={() => {
                                                const newBrands = filterBrands.includes(brand)
                                                    ? filterBrands.filter(b => b !== brand)
                                                    : [...filterBrands, brand];
                                                setFilterBrands(newBrands);
                                            }}
                                        />
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 py-3 text-center">No se encontraron marcas</p>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {activeMobileFilter === 'specs' && (
                        <div>
                            <h3 className="text-lg font-medium mb-3">Especificaciones</h3>
                            <div className="relative mb-3">
                                <input
                                    type="text"
                                    placeholder="Buscar especificación..."
                                    className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md"
                                    value={searchSpecification}
                                    onChange={(e) => setSearchSpecification(e.target.value)}
                                />
                                <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
                            </div>
                            
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                                {Object.keys(availableFilters.specifications)
                                    .filter(key => getSpecificationLabel(key).toLowerCase().includes(searchSpecification.toLowerCase()))
                                    .map(specKey => (
                                        <div key={specKey} className="border-b pb-4 last:border-0">
                                            <h4 className="font-medium text-gray-800 mb-2 bg-gray-100 p-2 rounded">
                                                {getSpecificationLabel(specKey)}
                                            </h4>
                                            <div className="space-y-2 ml-1 border-l-2 border-green-100 pl-2">
                                                {availableFilters.specifications[specKey].map(value => (
                                                    <FilterCheckbox
                                                        key={`${specKey}-${value}`}
                                                        label={value}
                                                        checked={(specFilters[specKey] || []).includes(value)}
                                                        onChange={() => handleSpecFilterChange(specKey, value)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                }
                                {Object.keys(availableFilters.specifications).length === 0 && (
                                    <p className="text-sm text-gray-500 py-2 text-center italic">
                                        Selecciona una categoría para ver las especificaciones disponibles
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {activeMobileFilter === 'sort' && (
                        <div>
                            <h3 className="text-lg font-medium mb-3">Ordenar por</h3>
                            <div className="space-y-2 border border-gray-200 rounded p-2 bg-white">
                                <label className="flex items-center py-3 cursor-pointer border-b">
                                    <input
                                        type="radio"
                                        name="sortByMobile"
                                        value="asc"
                                        checked={sortBy === 'asc'}
                                        onChange={() => setSortBy('asc')}
                                        className="text-green-600 focus:ring-green-500"
                                    />
                                    <span className="ml-2">Precio: Menor a mayor</span>
                                </label>
                                <label className="flex items-center py-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sortByMobile"
                                        value="dsc"
                                        checked={sortBy === 'dsc'}
                                        onChange={() => setSortBy('dsc')}
                                        className="text-green-600 focus:ring-green-500"
                                    />
                                    <span className="ml-2">Precio: Mayor a menor</span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // Renderizado del componente completo
    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header de la página y controles */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2 lg:mb-0">
                    {getSeoTitle()}
                </h1>
                
                <div className="flex flex-wrap items-center space-x-2">
                    {/* Contador de resultados para móvil */}
                    <span className="lg:hidden text-sm text-gray-600 mr-auto">
                        {data.length} {data.length === 1 ? 'producto' : 'productos'}
                    </span>
                
                    {/* Botones de vista cuadrícula/lista (solo desktop) */}
                    <div className="hidden lg:flex items-center bg-gray-100 rounded-lg p-1">
                        <button 
                            className={`p-2 rounded ${gridView ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                            onClick={() => setGridView(true)}
                            aria-label="Vista de cuadrícula"
                        >
                            <IoGridOutline size={20} />
                        </button>
                        <button 
                            className={`p-2 rounded ${!gridView ? 'bg-white shadow-sm' : 'text-gray-600'}`}
                            onClick={() => setGridView(false)}
                            aria-label="Vista de lista"
                        >
                            <IoMenuOutline size={20} />
                        </button>
                    </div>
                    
                    {/* Botón de filtro móvil */}
                    <button 
                        className="lg:hidden flex items-center py-2 px-4 bg-green-600 text-white rounded-lg shadow-sm"
                        onClick={() => setMobileFilterOpen(true)}
                    >
                        <BiFilter className="mr-1" />
                        Filtrar
                        {filterCount > 0 && (
                            <span className="ml-1 px-1.5 bg-white text-green-800 rounded-full text-xs">
                                {filterCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Mostrar filtros activos */}
            {hasActiveFilters() && (
                <div className="mb-4 lg:mb-6">
                    {renderActiveFilters()}
                </div>
            )}

            {/* Contenido principal grid */}
{/* Sidebar filtros (solo desktop) */}
<div className="flex flex-col lg:flex-row lg:space-x-6">
  {/* Sidebar filtros (solo desktop) */}
  <div className="hidden lg:block w-64 flex-shrink-0">
    <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      {renderDesktopFilters()}
    </div>
  </div>

{/* Lista de productos */}
<div className="flex-grow">
    {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-3"></div>
                <p className="text-gray-600">Cargando productos...</p>
            </div>
        </div>
    ) : data.length > 0 ? (
        <div className="transition-opacity duration-300" style={{ opacity: loading ? 0.5 : 1 }}>
            <VerticalCard data={data} loading={loading} gridView={gridView} />
        </div>
    ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
            <div className="mb-4 text-gray-400">
                <BiX size={48} className="mx-auto" />
            </div>
            <p className="text-lg text-gray-600 mb-4">No se encontraron productos con los filtros seleccionados</p>
            <button 
                onClick={clearAllFilters}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
                Limpiar filtros
            </button>
        </div>
    )}
</div>
</div>

{/* Panel de filtro móvil */}
{renderMobileFilterPanel()}
</div>
);
};

export default CategoryProduct;