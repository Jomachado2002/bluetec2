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
    ramText: { type: String},
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
    
    // Informática - Procesador
    model: { type: String },
    processorModel: { type: String },
    processorSocket: { type: String },
    processorCores: { type: String },
    processorThreads: { type: String },
    processorBaseFreq: { type: String },
    processorTurboFreq: { type: String },
    processorCache: { type: String },
    processorTDP: { type: String },
    
    // Informática - Fuentes de Poder (Movido desde Accesorios)
    psuWattage: { type: String },
    psuEfficiency: { type: String },
    psuModular: { type: String },
    psuFormFactor: { type: String },
    psuProtections: { type: String },
    
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
    
    // Energía - UPS (Movido desde Accesorios)
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
    landlineHandsets: { type: String },
    // Tablets
tabletScreenSize: { type: String },
tabletScreenResolution: { type: String },
tabletProcessor: { type: String },
tabletRAM: { type: String },
tabletStorage: { type: String },
tabletOS: { type: String },
tabletConnectivity: { type: String },

// Redes - Switch
switchType: { type: String },
switchPorts: { type: String },
switchPortSpeed: { type: String },
switchNetworkLayer: { type: String },
switchCapacity: { type: String },

// Servidores
serverType: { type: String },
serverProcessor: { type: String },
serverProcessorCount: { type: String },
serverRAM: { type: String },
serverStorage: { type: String },
serverOS: { type: String },

// Cables de Red
networkCableType: { type: String },
networkCableCategory: { type: String },
networkCableLength: { type: String },
networkCableShielding: { type: String },
networkCableRecommendedUse: { type: String },

// Racks
rackType: { type: String },
rackUnits: { type: String },
rackDepth: { type: String },
rackMaterial: { type: String },
rackLoadCapacity: { type: String },

// Access Point
apWiFiStandard: { type: String },
apSupportedBands: { type: String },
apMaxSpeed: { type: String },
apPorts: { type: String },
apAntennas: { type: String },

// Tarjetas Gráficas
graphicCardModel: { type: String },
graphicCardMemory: { type: String },
graphicCardMemoryType: { type: String },
graphicCardBaseFrequency: { type: String },
graphicfabricate: { type: String },
graphicCardTDP: { type: String },

// Gabinetes
caseFormFactor: { type: String },
caseMaterial: { type: String },
caseExpansionBays: { type: String },
caseIncludedFans: { type: String },
caseCoolingSupport: { type: String },
caseBacklight: { type: String },

// Auriculares
headphoneConnectionType: { type: String },
headphoneTechnology: { type: String },
headphoneFrequencyResponse: { type: String },
headphoneImpedance: { type: String },
headphoneNoiseCancel: { type: String },
headphoneBatteryLife: { type: String },

// Microfonos
microphoneType: { type: String },
microphonePolarPattern: { type: String },
microphoneFrequencyRange: { type: String },
microphoneConnection: { type: String },
microphoneSpecialFeatures: { type: String },

// NAS
nasMaxCapacity: { type: String },
nasBaysNumber: { type: String },
nasProcessor: { type: String },
nasRAM: { type: String },


// Cartuchos de Toner
tonerPrinterType: { type: String },
tonerColor: { type: String },
tonerYield: { type: String },
tonerCartridgeType: { type: String },
tonerCompatibleModel: { type: String },


    // Campos financieros
    purchasePrice: { type: Number, default: 0 }, // Precio de compra
    loanInterest: { type: Number, default: 0 },  // Interés sobre préstamo, en porcentaje
    deliveryCost: { type: Number, default: 0 },  // Costo de envío/delivery
    profitMargin: { type: Number, default: 0 },  // Margen de ganancia calculado
    profitAmount: { type: Number, default: 0 },  // Utilidad calculada en monto
    lastUpdatedFinance: { type: Date },          // Fecha de última actualización financiera

    // Campos para presupuestos y seguimiento
    budgets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'budget'
    }],
    sales: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sale'
    }]
}, {
    timestamps: true
});


// Creamos un índice para el slug para búsquedas más rápidas
productSchema.index({ slug: 1 }, { unique: true, sparse: true });

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;