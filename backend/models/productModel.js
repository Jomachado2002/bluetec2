const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productName: { type: String, required: true },
    brandName: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    productImage: { type: [String], required: true },
    documentationLink: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    
    // Informática - Notebooks
    processor: { type: String },
    memory: { type: String },
    storage: { type: String },
    disk: { type: String },
    graphicsCard: { type: String },
    notebookScreen: { type: String },
    notebookBattery: { type: String },
    
    // Informática - Computadoras Ensambladas
    pcCase: { type: String },
    pcPowerSupply: { type: String },
    pcCooling: { type: String },
    
    // Informática - Placas Madre
    motherboardSocket: { type: String },
    motherboardChipset: { type: String },
    motherboardFormFactor: { type: String },
    expansionSlots: { type: String },
    
    // Informática - Memorias RAM
    ramType: { type: String },
    ramSpeed: { type: String },
    ramCapacity: { type: String },
    ramLatency: { type: String },
    
    // Informática - Discos Duros
    hddCapacity: { type: String },
    diskType: { type: String },
    hddInterface: { type: String },
    hddRPM: { type: String },
    diskReadSpeed: { type: String },
    diskWriteSpeed: { type: String },
    
    // Periféricos - Monitores
    monitorSize: { type: String },
    monitorResolution: { type: String },
    monitorRefreshRate: { type: String },
    monitorPanel: { type: String },
    monitorConnectivity: { type: String },
    
    // Periféricos - Teclados
    keyboardInterface: { type: String },
    keyboardLayout: { type: String },
    keyboardBacklight: { type: String },
    keyboardSwitches: { type: String },
    keyboardFeatures: { type: String },
    
    // Periféricos - Mouses
    mouseInterface: { type: String },
    mouseSensor: { type: String },
    mouseDPI: { type: String },
    mouseButtons: { type: String },
    mouseBacklight: { type: String },
    
    // Periféricos - Adaptadores
    adapterType: { type: String },
    adapterInterface: { type: String },
    adapterSpeed: { type: String },
    adapterProtocol: { type: String },
    
    // CCTV - Cámaras de Seguridad
    cameraResolution: { type: String },
    cameraLensType: { type: String },
    cameraIRDistance: { type: String },
    cameraType: { type: String },
    cameraConnectivity: { type: String },
    cameraProtection: { type: String },
    
    // CCTV - Grabadores DVR
    dvrChannels: { type: String },
    dvrResolution: { type: String },
    dvrStorageCapacity: { type: String },
    dvrConnectivity: { type: String },
    dvrSmartFeatures: { type: String },
    
    // CCTV - NAS
    nasCapacity: { type: String },
    nasBays: { type: String },
    nasRAID: { type: String },
    nasConnectivity: { type: String },
    
    // Impresoras - Láser y Multifunción
    printerType: { type: String },
    printerResolution: { type: String },
    printerSpeed: { type: String },
    printerDuplex: { type: String },
    printerFunctions: { type: String },
    printerConnectivity: { type: String },
    printerDisplay: { type: String },
    printerTrayCapacity: { type: String },
    
    // Accesorios - Fuentes de Alimentación
    psuWattage: { type: String },
    psuEfficiency: { type: String },
    psuModular: { type: String },
    psuFormFactor: { type: String },
    psuProtections: { type: String },
    
    // Accesorios - UPS
    upsCapacity: { type: String },
    upsOutputPower: { type: String },
    upsBackupTime: { type: String },
    upsOutlets: { type: String },
    upsType: { type: String },
    upsConnectivity: { type: String },
    
    // Accesorios - Airpods
    airpodsModel: { type: String },
    airpodsBatteryLife: { type: String },
    airpodsCharging: { type: String },
    airpodsResistance: { type: String },
    airpodsFeatures: { type: String },
    
    // Software y Licencias
    softwareLicenseType: { type: String },
    softwareLicenseDuration: { type: String },
    softwareLicenseQuantity: { type: String },
    softwareVersion: { type: String },
    softwareFeatures: { type: String },
    
    // Telefonía - Teléfonos Móviles
    phoneType: { type: String },
    phoneScreenSize: { type: String },
    phoneRAM: { type: String },
    phoneStorage: { type: String },
    phoneProcessor: { type: String },
    phoneCameras: { type: String },
    phoneBattery: { type: String },
    phoneOS: { type: String },
    
    // Telefonía - Teléfonos Fijos
    landlineType: { type: String },
    landlineTechnology: { type: String },
    landlineDisplay: { type: String },
    landlineFunctions: { type: String },
    landlineHandsets: { type: String }
}, {
    timestamps: true
});

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;