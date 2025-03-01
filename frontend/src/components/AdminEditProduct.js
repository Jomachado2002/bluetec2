import React, { useState, useEffect } from 'react';
import { IoIosClose, IoMdTrash } from "react-icons/io";
import productCategory from '../helpers/productCategory';
import { FaUpload } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { FaDeleteLeft } from "react-icons/fa6";
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import ProductSpecifications from './ProductSpecifications';

const AdminEditProduct = ({
    onClose,
    productData,
    fetchdata
}) => {
    // Inicializar datos con un objeto vacío para cada posible campo de especificación
    const initialData = {
        // Datos básicos del producto
        productName: productData?.productName || "",
        brandName: productData?.brandName || "",
        category: productData?.category || "",
        subcategory: productData?.subcategory || "",
        productImage: productData?.productImage || [],
        documentationLink: productData?.documentationLink || "",
        description: productData?.description || "",
        price: productData?.price || "",
        sellingPrice: productData?.sellingPrice || "",
        
        // Campos específicos por categoría inicializados con valores del productData
        // Informática - Notebooks
        processor: productData?.processor || "",
        memory: productData?.memory || "",
        storage: productData?.storage || "",
        disk: productData?.disk || "",
        graphicsCard: productData?.graphicsCard || "",
        notebookScreen: productData?.notebookScreen || "",
        notebookBattery: productData?.notebookBattery || "",
        
        // Informática - Computadoras Ensambladas
        pcCase: productData?.pcCase || "",
        pcPowerSupply: productData?.pcPowerSupply || "",
        pcCooling: productData?.pcCooling || "",
        
        // Informática - Placas Madre
        motherboardSocket: productData?.motherboardSocket || "",
        motherboardChipset: productData?.motherboardChipset || "",
        motherboardFormFactor: productData?.motherboardFormFactor || "",
        expansionSlots: productData?.expansionSlots || "",
        
        // Informática - Procesador
        processorSocket: productData?.processorSocket || "",
        processorCores: productData?.processorCores || "",
        processorThreads: productData?.processorThreads || "",
        processorBaseFreq: productData?.processorBaseFreq || "",
        processorTurboFreq: productData?.processorTurboFreq || "",
        processorCache: productData?.processorCache || "",
        processorTDP: productData?.processorTDP || "",
        processorIntegratedGraphics: productData?.processorIntegratedGraphics || "",
        processorManufacturingTech: productData?.processorManufacturingTech || "",
        
        // Informática - Tarjetas Gráficas
        graphicCardModel: productData?.graphicCardModel || "",
        graphicCardMemory: productData?.graphicCardMemory || "",
        graphicCardMemoryType: productData?.graphicCardMemoryType || "",
        graphicCardBaseFrequency: productData?.graphicCardBaseFrequency || "",
        graphicfabricate: productData?.graphicfabricate || "", // Nombre correcto para fabricante
        graphicCardTDP: productData?.graphicCardTDP || "",
        
        // Informática - Gabinetes
        caseFormFactor: productData?.caseFormFactor || "",
        caseMaterial: productData?.caseMaterial || "",
        caseExpansionBays: productData?.caseExpansionBays || "",
        caseIncludedFans: productData?.caseIncludedFans || "",
        caseCoolingSupport: productData?.caseCoolingSupport || "",
        caseBacklight: productData?.caseBacklight || "",
        
        // Informática - Memorias RAM
        ramType: productData?.ramType || "",
        ramSpeed: productData?.ramSpeed || "",
        ramCapacity: productData?.ramCapacity || "",
        ramLatency: productData?.ramLatency || "",
        
        // Informática - Discos duros
        hddCapacity: productData?.hddCapacity || "",
        diskType: productData?.diskType || "",
        hddInterface: productData?.hddInterface || "",
        hddRPM: productData?.hddRPM || "",
        diskReadSpeed: productData?.diskReadSpeed || "",
        diskWriteSpeed: productData?.diskWriteSpeed || "",
        
        // Periféricos - Monitores
        monitorSize: productData?.monitorSize || "",
        monitorResolution: productData?.monitorResolution || "",
        monitorRefreshRate: productData?.monitorRefreshRate || "",
        monitorPanel: productData?.monitorPanel || "",
        monitorConnectivity: productData?.monitorConnectivity || "",
        
        // Periféricos - Teclados
        keyboardInterface: productData?.keyboardInterface || "",
        keyboardLayout: productData?.keyboardLayout || "",
        keyboardBacklight: productData?.keyboardBacklight || "",
        keyboardSwitches: productData?.keyboardSwitches || "",
        keyboardFeatures: productData?.keyboardFeatures || "",
        
        // Periféricos - Mouses
        mouseInterface: productData?.mouseInterface || "",
        mouseSensor: productData?.mouseSensor || "",
        mouseDPI: productData?.mouseDPI || "",
        mouseButtons: productData?.mouseButtons || "",
        mouseBacklight: productData?.mouseBacklight || "",
        
        // Periféricos - Adaptadores
        adapterType: productData?.adapterType || "",
        adapterInterface: productData?.adapterInterface || "",
        adapterSpeed: productData?.adapterSpeed || "",
        adapterProtocol: productData?.adapterProtocol || "",
        
        // Periféricos - Auriculares
        headphoneConnectionType: productData?.headphoneConnectionType || "",
        headphoneTechnology: productData?.headphoneTechnology || "",
        headphoneFrequencyResponse: productData?.headphoneFrequencyResponse || "",
        headphoneImpedance: productData?.headphoneImpedance || "",
        headphoneNoiseCancel: productData?.headphoneNoiseCancel || "",
        headphoneBatteryLife: productData?.headphoneBatteryLife || "",
        
        // Periféricos - Micrófonos
        microphoneType: productData?.microphoneType || "",
        microphonePolarPattern: productData?.microphonePolarPattern || "",
        microphoneFrequencyRange: productData?.microphoneFrequencyRange || "",
        microphoneConnection: productData?.microphoneConnection || "",
        microphoneSpecialFeatures: productData?.microphoneSpecialFeatures || "",
        
        // CCTV - Cámaras
        cameraResolution: productData?.cameraResolution || "",
        cameraLensType: productData?.cameraLensType || "",
        cameraIRDistance: productData?.cameraIRDistance || "",
        cameraType: productData?.cameraType || "",
        cameraConnectivity: productData?.cameraConnectivity || "",
        cameraProtection: productData?.cameraProtection || "",
        
        // CCTV - DVR
        dvrChannels: productData?.dvrChannels || "",
        dvrResolution: productData?.dvrResolution || "",
        dvrStorageCapacity: productData?.dvrStorageCapacity || "",
        dvrConnectivity: productData?.dvrConnectivity || "",
        dvrSmartFeatures: productData?.dvrSmartFeatures || "",
        
        // CCTV - NAS
        nasMaxCapacity: productData?.nasMaxCapacity || "",
        nasBaysNumber: productData?.nasBaysNumber || "",
        nasProcessor: productData?.nasProcessor || "",
        nasRAM: productData?.nasRAM || "",
        nasRAIDSupport: productData?.nasRAIDSupport || "",
        nasConnectivity: productData?.nasConnectivity || "",
        
        // Impresoras
        printerType: productData?.printerType || "",
        printerResolution: productData?.printerResolution || "",
        printerSpeed: productData?.printerSpeed || "",
        printerDuplex: productData?.printerDuplex || "",
        printerConnectivity: productData?.printerConnectivity || "",
        printerTrayCapacity: productData?.printerTrayCapacity || "",
        printerFunctions: productData?.printerFunctions || "",
        printerDisplay: productData?.printerDisplay || "",
        
        // Cartuchos/Toner
        tonerPrinterType: productData?.tonerPrinterType || "",
        tonerColor: productData?.tonerColor || "",
        tonerYield: productData?.tonerYield || "",
        tonerCartridgeType: productData?.tonerCartridgeType || "",
        tonerCompatibleModel: productData?.tonerCompatibleModel || "",
        
        // Energía
        psuWattage: productData?.psuWattage || "",
        psuEfficiency: productData?.psuEfficiency || "",
        psuModular: productData?.psuModular || "",
        psuFormFactor: productData?.psuFormFactor || "",
        psuProtections: productData?.psuProtections || "",
        
        // UPS
        upsCapacity: productData?.upsCapacity || "",
        upsOutputPower: productData?.upsOutputPower || "",
        upsBackupTime: productData?.upsBackupTime || "",
        upsOutlets: productData?.upsOutlets || "",
        upsType: productData?.upsType || "",
        upsConnectivity: productData?.upsConnectivity || "",
        
        // Software y Licencias
        softwareLicenseType: productData?.softwareLicenseType || "",
        softwareLicenseDuration: productData?.softwareLicenseDuration || "",
        softwareLicenseQuantity: productData?.softwareLicenseQuantity || "",
        softwareVersion: productData?.softwareVersion || "",
        softwareFeatures: productData?.softwareFeatures || "",
        
        // Telefonía
        phoneType: productData?.phoneType || "",
        phoneScreenSize: productData?.phoneScreenSize || "",
        phoneRAM: productData?.phoneRAM || "",
        phoneStorage: productData?.phoneStorage || "",
        phoneProcessor: productData?.phoneProcessor || "",
        phoneCameras: productData?.phoneCameras || "",
        phoneBattery: productData?.phoneBattery || "",
        phoneOS: productData?.phoneOS || "",
        
        // Telefonía - Fijos
        landlineType: productData?.landlineType || "",
        landlineTechnology: productData?.landlineTechnology || "",
        landlineDisplay: productData?.landlineDisplay || "",
        landlineFunctions: productData?.landlineFunctions || "",
        landlineHandsets: productData?.landlineHandsets || "",
        
        // Telefonía - Tablets
        tabletScreenSize: productData?.tabletScreenSize || "",
        tabletScreenResolution: productData?.tabletScreenResolution || "",
        tabletProcessor: productData?.tabletProcessor || "",
        tabletRAM: productData?.tabletRAM || "",
        tabletStorage: productData?.tabletStorage || "",
        tabletOS: productData?.tabletOS || "",
        tabletConnectivity: productData?.tabletConnectivity || "",
        
        // Redes
        switchType: productData?.switchType || "",
        switchPorts: productData?.switchPorts || "",
        switchPortSpeed: productData?.switchPortSpeed || "",
        switchNetworkLayer: productData?.switchNetworkLayer || "",
        switchCapacity: productData?.switchCapacity || "",
        
        // Redes - Servidores
        serverType: productData?.serverType || "",
        serverProcessor: productData?.serverProcessor || "",
        serverProcessorCount: productData?.serverProcessorCount || "",
        serverRAM: productData?.serverRAM || "",
        serverStorage: productData?.serverStorage || "",
        serverOS: productData?.serverOS || "",
        
        // Redes - Cables
        networkCableType: productData?.networkCableType || "",
        networkCableCategory: productData?.networkCableCategory || "",
        networkCableLength: productData?.networkCableLength || "",
        networkCableShielding: productData?.networkCableShielding || "",
        networkCableRecommendedUse: productData?.networkCableRecommendedUse || "",
        
        // Redes - Racks
        rackType: productData?.rackType || "",
        rackUnits: productData?.rackUnits || "",
        rackDepth: productData?.rackDepth || "",
        rackMaterial: productData?.rackMaterial || "",
        rackLoadCapacity: productData?.rackLoadCapacity || "",
        
        // Redes - Access Point
        apWiFiStandard: productData?.apWiFiStandard || "",
        apSupportedBands: productData?.apSupportedBands || "",
        apMaxSpeed: productData?.apMaxSpeed || "",
        apPorts: productData?.apPorts || "",
        apAntennas: productData?.apAntennas || "",
        
        // Accesorios
        airpodsModel: productData?.airpodsModel || "",
        airpodsBatteryLife: productData?.airpodsBatteryLife || "",
        airpodsCharging: productData?.airpodsCharging || "",
        airpodsResistance: productData?.airpodsResistance || "",
        airpodsFeatures: productData?.airpodsFeatures || ""
    };

    const [data, setData] = useState(initialData);
    const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Efecto para cargar todos los campos del producto desde productData
    useEffect(() => {
        if (productData) {
            // Asegurarse de que todos los campos sean incluidos
            setData({
                ...initialData,
                ...productData
            });
        }
    }, [productData]);

    const handleOnChange = (e) => {
        const { name, value, type } = e.target;
        setData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleUploadProduct = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const uploadImageCloudinary = await uploadImage(file);
            if (uploadImageCloudinary?.url) {
                setData(prev => ({
                    ...prev,
                    productImage: [...prev.productImage, uploadImageCloudinary.url]
                }));
            }
        } catch (error) {
            toast.error("Error al cargar la imagen");
        }
    };

    const handleDeleteProductImage = (index) => {
        const newProductImage = [...data.productImage];
        newProductImage.splice(index, 1);
        setData(prev => ({
            ...prev,
            productImage: newProductImage
        }));
    };

    const handleDeleteProduct = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
            setIsDeleting(true);
            try {
                const response = await fetch(SummaryApi.deleteProductController.url, {
                    method: SummaryApi.deleteProductController.method,
                    credentials: 'include',
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({ productId: productData._id })
                });

                const responseData = await response.json();
                if (responseData.success) {
                    toast.success("Producto eliminado correctamente");
                    onClose();
                    fetchdata();
                } else {
                    toast.error(responseData?.message || "Error al eliminar el producto");
                }
            } catch (error) {
                toast.error("Error de conexión al eliminar el producto");
                console.error(error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!data.productName || !data.brandName || !data.category || !data.subcategory) {
            toast.error("Por favor, complete todos los campos requeridos");
            return;
        }

        if (data.productImage.length === 0) {
            toast.error("Por favor, cargue al menos una imagen del producto");
            return;
        }

        try {
            const response = await fetch(SummaryApi.updateProduct.url, {
                method: SummaryApi.updateProduct.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            if (responseData.success) {
                toast.success(responseData?.message);
                onClose();
                fetchdata();
            } else {
                toast.error(responseData?.message || "Error al actualizar el producto");
            }
        } catch (error) {
            toast.error("Error de conexión al actualizar el producto");
            console.error(error);
        }
    };

    // Función para obtener el nombre de la subcategoría actual
    const getCurrentSubcategoryLabel = () => {
        const category = productCategory.find(cat => cat.value === data.category);
        if (!category) return 'Producto';
        
        const subcategory = category.subcategories.find(subcat => subcat.value === data.subcategory);
        return subcategory ? subcategory.label : 'Producto';
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-y-auto'>
            <div className='bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col'>
                {/* Encabezado */}
                <div className='flex justify-between items-center p-4 border-b'>
                    <h2 className='font-bold text-xl text-gray-800 flex items-center'>
                        <span className='mr-3'>Editar Producto</span>
                        <button 
                            onClick={handleDeleteProduct}
                            disabled={isDeleting}
                            className='text-red-600 hover:text-red-800 transition-colors duration-300 
                                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center'
                            title='Eliminar Producto'
                        >
                            <IoMdTrash className='text-2xl' />
                        </button>
                    </h2>
                    <button 
                        className='text-3xl text-gray-600 hover:text-black transition-colors duration-300' 
                        onClick={onClose}
                    >
                        <IoIosClose />
                    </button>
                </div>

                {/* Formulario con scroll interno */}
                <form 
                    onSubmit={handleSubmit} 
                    className='grid grid-cols-2 gap-4 p-4 overflow-y-auto flex-grow'
                >
                    {/* Columna Izquierda */}
                    <div className='space-y-4'>
                        <div>
                            <label htmlFor='productName' className='block text-sm font-medium text-gray-700 mb-1'>
                                Nombre del Producto
                            </label>
                            <input
                                type='text'
                                id='productName'
                                name='productName'
                                value={data.productName}
                                onChange={handleOnChange}
                                className='w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg 
                                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                           transition-all duration-300'
                                placeholder='Ingresa el nombre del producto'
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor='brandName' className='block text-sm font-medium text-gray-700 mb-1'>
                                Marca
                            </label>
                            <input
                                type='text'
                                id='brandName'
                                name='brandName'
                                value={data.brandName}
                                onChange={handleOnChange}
                                className='w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg 
                                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                           transition-all duration-300'
                                placeholder='Ingresa la marca'
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor='category' className='block text-sm font-medium text-gray-700 mb-1'>
                                Categoría
                            </label>
                            <select
                                id='category'
                                name='category'
                                value={data.category}
                                onChange={handleOnChange}
                                className='w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg 
                                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                           transition-all duration-300'
                                required
                            >
                                <option value="">Selecciona una categoría</option>
                                {productCategory.map((cat) => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        {data.category && (
                            <div>
                                <label htmlFor='subcategory' className='block text-sm font-medium text-gray-700 mb-1'>
                                    Subcategoría
                                </label>
                                <select
                                    id='subcategory'
                                    name='subcategory'
                                    value={data.subcategory}
                                    onChange={handleOnChange}
                                    className='w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg 
                                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                               transition-all duration-300'
                                    required
                                >
                                    <option value="">Selecciona una subcategoría</option>
                                    {(productCategory.find(cat => cat.value === data.category)?.subcategories || []).map(subcat => (
                                        <option key={subcat.value} value={subcat.value}>{subcat.label}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label htmlFor='price' className='block text-sm font-medium text-gray-700 mb-1'>
                                Precio
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={data.price}
                                onChange={handleOnChange}
                                className='w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg 
                                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                           transition-all duration-300'
                                placeholder="Ingresa el precio"
                                required
                            />
                        </div>
                    </div>

                    {/* Columna Derecha */}
                    <div className='space-y-4'>
                        <div>
                            <label htmlFor="description" className='block text-sm font-medium text-gray-700 mb-1'>
                                Descripción del Producto
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={handleOnChange}
                                className='w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg 
                                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                           transition-all duration-300 h-32 resize-none'
                                placeholder="Ingresa la descripción del producto"
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="sellingPrice" className='block text-sm font-medium text-gray-700 mb-1'>
                                Precio de Venta
                            </label>
                            <input
                                type="number"
                                id="sellingPrice"
                                name="sellingPrice"
                                value={data.sellingPrice}
                                onChange={handleOnChange}
                                className='w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg 
                                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                           transition-all duration-300'
                                placeholder="Ingresa el precio de venta"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="documentationLink" className='block text-sm font-medium text-gray-700 mb-1'>
                                Enlace de Documentación (Opcional)
                            </label>
                            <input
                                type="text"
                                id="documentationLink"
                                name="documentationLink"
                                value={data.documentationLink}
                                onChange={handleOnChange}
                                className='w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg 
                                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                           transition-all duration-300'
                                placeholder="Ingresa el enlace de documentación"
                            />
                        </div>

                        {/* Sección de Imágenes */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Imágenes del Producto
                            </label>
                            <label htmlFor="uploadImageInput" className='block'>
                                <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-300 
                                                rounded-lg text-center cursor-pointer 
                                                hover:border-blue-500 transition-all duration-300">
                                    <div className="text-gray-500 flex justify-center items-center flex-col gap-2">
                                        <FaUpload className='text-4xl text-gray-400' />
                                        <p className="text-sm">Cargar Imagen del Producto</p>
                                        <input 
                                            type="file" 
                                            id="uploadImageInput" 
                                            className="hidden" 
                                            onChange={handleUploadProduct} 
                                        />
                                    </div>
                                </div>
                            </label>

                            {/* Galería de Imágenes */}
                            <div className="flex gap-3 mt-3 flex-wrap">
                                {data?.productImage.map((el, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={el}
                                            alt={`Producto ${index + 1}`}
                                            className="w-24 h-24 object-cover rounded-lg 
                                                       border border-gray-200 cursor-pointer"
                                            onClick={() => {
                                                setOpenFullScreenImage(true);
                                                setFullScreenImage(el);
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="absolute -top-2 -right-2 bg-red-500 text-white 
                                                       rounded-full p-1 opacity-0 group-hover:opacity-100 
                                                       transition-opacity duration-300"
                                            onClick={() => handleDeleteProductImage(index)}
                                        >
                                            <FaDeleteLeft />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Campos específicos por subcategoría */}
                    {data.subcategory && (
                        <div className='col-span-2 border-t pt-4 mt-4'>
                            <h3 className='text-lg font-semibold mb-3 text-gray-800'>
                                Especificaciones de {getCurrentSubcategoryLabel()}
                            </h3>
                            <ProductSpecifications
                                subcategory={data.subcategory}
                                data={data}
                                handleOnChange={handleOnChange}
                            />
                        </div>
                    )}

                    {/* Botón de Actualizar */}
                    <div className='col-span-2 flex justify-end'>
                        <button 
                            type="submit" 
                            className='px-6 py-2 bg-green-600 text-white rounded-lg 
                                    hover:bg-green-700 transition-colors duration-300 
                                    flex items-center gap-2'
                        >
                            Actualizar Producto
                        </button>
                    </div>
                </form>
            </div>

            {openFullScreenImage && (
                <DisplayImage 
                    onClose={() => setOpenFullScreenImage(false)} 
                    imgUrl={fullScreenImage} 
                />
            )}
        </div>
    );
};

export default AdminEditProduct;