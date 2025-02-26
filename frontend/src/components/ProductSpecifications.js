import React from 'react';

const ProductSpecifications = ({ 
  subcategory, 
  data, 
  handleOnChange 
}) => {
  // Definimos un mapeo de especificaciones por subcategoría
  const specificationsMap = {
    // Informática
    notebooks: [
      { 
        label: "Procesador", 
        name: "processor", 
        placeholder: "Ingresa el procesador" 
      },
      { 
        label: "Memoria RAM", 
        name: "memory", 
        placeholder: "Ingresa la cantidad de memoria RAM" 
      },
      { 
        label: "Almacenamiento", 
        name: "storage", 
        placeholder: "Ingresa el tipo y capacidad de almacenamiento" 
      },
      { 
        label: "Disco", 
        name: "disk", 
        placeholder: "Ingresa el tipo de disco (SSD/HDD)" 
      },
      { 
        label: "Tarjeta Gráfica", 
        name: "graphicsCard", 
        placeholder: "Ingresa la tarjeta gráfica (opcional)" 
      },
      { 
        label: "Pantalla", 
        name: "notebookScreen", 
        placeholder: "Ingresa el tamaño y resolución de pantalla" 
      },
      { 
        label: "Batería", 
        name: "notebookBattery", 
        placeholder: "Ingresa la capacidad de la batería" 
      }
    ],
    computadoras_ensambladas: [
      { 
        label: "Procesador", 
        name: "processor", 
        placeholder: "Ingresa el procesador" 
      },
      { 
        label: "Memoria RAM", 
        name: "memory", 
        placeholder: "Ingresa la cantidad de memoria RAM" 
      },
      { 
        label: "Almacenamiento", 
        name: "storage", 
        placeholder: "Ingresa el tipo y capacidad de almacenamiento" 
      },
      { 
        label: "Tarjeta Gráfica", 
        name: "graphicsCard", 
        placeholder: "Ingresa la tarjeta gráfica" 
      },
      { 
        label: "Gabinete", 
        name: "pcCase", 
        placeholder: "Ingresa el tipo de gabinete" 
      },
      { 
        label: "Fuente de Poder", 
        name: "pcPowerSupply", 
        placeholder: "Ingresa la fuente de poder" 
      },
      { 
        label: "Sistema de Enfriamiento", 
        name: "pcCooling", 
        placeholder: "Ingresa el sistema de enfriamiento" 
      }
    ],
    placas_madre: [
      { 
        label: "Socket", 
        name: "motherboardSocket", 
        placeholder: "Ingresa el tipo de socket" 
      },
      { 
        label: "Chipset", 
        name: "motherboardChipset", 
        placeholder: "Ingresa el chipset" 
      },
      { 
        label: "Factor de Forma", 
        name: "motherboardFormFactor", 
        placeholder: "Ingresa el factor de forma (ATX, mATX, etc.)" 
      },
      { 
        label: "Soporte de RAM", 
        name: "ramType", 
        placeholder: "Ingresa el tipo de RAM soportada" 
      },
      { 
        label: "Slots de Expansión", 
        name: "expansionSlots", 
        placeholder: "Ingresa los slots de expansión disponibles" 
      }
    ],
    procesador: [
      {
          label: "Socket",
          name: "processorSocket",
          placeholder: "Ingresa el tipo de socket (Ej: LGA1200, AM4)"
      },
      {
          label: "Núcleos",
          name: "processorCores",
          placeholder: "Ingresa el número de núcleos (Ej: 6, 8)"
      },
      {
          label: "Hilos",
          name: "processorThreads",
          placeholder: "Ingresa el número de hilos (Ej: 12, 16)"
      },
      {
          label: "Frecuencia Base",
          name: "processorBaseFreq",
          placeholder: "Ingresa la frecuencia base (Ej: 3.6 GHz)"
      },
      {
          label: "Frecuencia Turbo",
          name: "processorTurboFreq",
          placeholder: "Ingresa la frecuencia turbo (Ej: 4.9 GHz)"
      },
      {
          label: "Caché",
          name: "processorCache",
          placeholder: "Ingresa la cantidad de caché (Ej: 12 MB)"
      },
      {
          label: "TDP",
          name: "processorTDP",
          placeholder: "Ingresa el TDP (Ej: 65W, 95W)"
      },
      {
          label: "Gr�ficos Integrados",
          name: "processorIntegratedGraphics",
          placeholder: "Indica si tiene gráficos integrados (Ej: Sí/No)"
      },
      {
          label: "Tecnología de Fabricación",
          name: "processorManufacturingTech",
          placeholder: "Ingresa la tecnología de fabricación (Ej: 7nm, 14nm)"
      }
  ],
    memorias_ram: [
      { 
        label: "Tipo de RAM", 
        name: "ramType", 
        placeholder: "Ingresa el tipo de RAM (DDR4, DDR5, etc.)" 
      },
      { 
        label: "Velocidad", 
        name: "ramSpeed", 
        placeholder: "Ingresa la velocidad en MHz" 
      },
      { 
        label: "Capacidad", 
        name: "ramCapacity", 
        placeholder: "Ingresa la capacidad en GB" 
      },
      { 
        label: "Latencia", 
        name: "ramLatency", 
        placeholder: "Ingresa la latencia (CL)" 
      }
    ],
    discos_duros: [
      { 
        label: "Capacidad", 
        name: "hddCapacity", 
        placeholder: "Ingresa la capacidad de almacenamiento" 
      },
      { 
        label: "Tipo", 
        name: "diskType", 
        placeholder: "Ingresa el tipo de disco (SSD/HDD/NVMe)" 
      },
      { 
        label: "Interfaz", 
        name: "hddInterface", 
        placeholder: "Ingresa el tipo de interfaz (SATA/NVMe/etc.)" 
      },
      { 
        label: "RPM (para HDD)", 
        name: "hddRPM", 
        placeholder: "Ingresa las RPM (solo para discos HDD)" 
      },
      { 
        label: "Velocidad de Lectura", 
        name: "diskReadSpeed", 
        placeholder: "Ingresa la velocidad de lectura" 
      },
      { 
        label: "Velocidad de Escritura", 
        name: "diskWriteSpeed", 
        placeholder: "Ingresa la velocidad de escritura" 
      }
    ],
    // Periféricos
    monitores: [
      { 
        label: "Tamaño", 
        name: "monitorSize", 
        placeholder: "Ingresa el tamaño en pulgadas" 
      },
      { 
        label: "Resolución", 
        name: "monitorResolution", 
        placeholder: "Ingresa la resolución (Full HD, 4K, etc.)" 
      },
      { 
        label: "Tasa de Refresco", 
        name: "monitorRefreshRate", 
        placeholder: "Ingresa la tasa de refresco en Hz" 
      },
      { 
        label: "Tipo de Panel", 
        name: "monitorPanel", 
        placeholder: "Ingresa el tipo de panel (IPS, VA, TN, etc.)" 
      },
      { 
        label: "Conectividad", 
        name: "monitorConnectivity", 
        placeholder: "Ingresa los tipos de conexiones" 
      }
    ],
    teclados: [
      { 
        label: "Interfaz", 
        name: "keyboardInterface", 
        placeholder: "Ingresa el tipo de interfaz (USB, Inalámbrico)" 
      },
      { 
        label: "Layout", 
        name: "keyboardLayout", 
        placeholder: "Ingresa el layout (Español, Inglés, etc.)" 
      },
      { 
        label: "Iluminación", 
        name: "keyboardBacklight", 
        placeholder: "Ingresa el tipo de iluminación" 
      },
      { 
        label: "Tipo de Switches", 
        name: "keyboardSwitches", 
        placeholder: "Ingresa el tipo de switches" 
      },
      { 
        label: "Características Adicionales", 
        name: "keyboardFeatures", 
        placeholder: "Ingresa características adicionales" 
      }
    ],
    mouses: [
      { 
        label: "Interfaz", 
        name: "mouseInterface", 
        placeholder: "Ingresa el tipo de interfaz (USB, Inalámbrico)" 
      },
      { 
        label: "Sensor", 
        name: "mouseSensor", 
        placeholder: "Ingresa el tipo de sensor (Óptico, Láser)" 
      },
      { 
        label: "DPI", 
        name: "mouseDPI", 
        placeholder: "Ingresa la resolución en DPI" 
      },
      { 
        label: "Número de Botones", 
        name: "mouseButtons", 
        placeholder: "Ingresa el número de botones" 
      },
      { 
        label: "Iluminación", 
        name: "mouseBacklight", 
        placeholder: "Ingresa el tipo de iluminación" 
      }
    ],
    adaptadores: [
      { 
        label: "Tipo de Adaptador", 
        name: "adapterType", 
        placeholder: "Ingresa el tipo de adaptador" 
      },
      { 
        label: "Interfaz", 
        name: "adapterInterface", 
        placeholder: "Ingresa la interfaz (USB, PCI, etc.)" 
      },
      { 
        label: "Velocidad", 
        name: "adapterSpeed", 
        placeholder: "Ingresa la velocidad de transferencia" 
      },
      { 
        label: "Protocolo", 
        name: "adapterProtocol", 
        placeholder: "Ingresa el protocolo (WiFi, Bluetooth, etc.)" 
      }
    ],
    // CCTV
    camaras_seguridad: [
      { 
        label: "Resolución", 
        name: "cameraResolution", 
        placeholder: "Ingresa la resolución" 
      },
      { 
        label: "Tipo de Lente", 
        name: "cameraLensType", 
        placeholder: "Ingresa el tipo de lente" 
      },
      { 
        label: "Distancia IR", 
        name: "cameraIRDistance", 
        placeholder: "Ingresa la distancia de visión nocturna" 
      },
      { 
        label: "Tipo de Cámara", 
        name: "cameraType", 
        placeholder: "Ingresa el tipo de cámara (Domo, Bullet, etc.)" 
      },
      { 
        label: "Conectividad", 
        name: "cameraConnectivity", 
        placeholder: "Ingresa el tipo de conectividad (IP, Analógica)" 
      },
      { 
        label: "Grado de Protección", 
        name: "cameraProtection", 
        placeholder: "Ingresa el grado de protección (IP66, etc.)" 
      }
    ],
    dvr: [
      { 
        label: "Número de Canales", 
        name: "dvrChannels", 
        placeholder: "Ingresa el número de canales" 
      },
      { 
        label: "Resolución Máxima", 
        name: "dvrResolution", 
        placeholder: "Ingresa la resolución máxima soportada" 
      },
      { 
        label: "Capacidad de Almacenamiento", 
        name: "dvrStorageCapacity", 
        placeholder: "Ingresa la capacidad de almacenamiento" 
      },
      { 
        label: "Conectividad", 
        name: "dvrConnectivity", 
        placeholder: "Ingresa las opciones de conectividad" 
      },
      { 
        label: "Características Inteligentes", 
        name: "dvrSmartFeatures", 
        placeholder: "Ingresa características inteligentes" 
      }
    ],
    nas: [
      { 
        label: "Capacidad", 
        name: "nasCapacity", 
        placeholder: "Ingresa la capacidad total" 
      },
      { 
        label: "Cantidad de Bahías", 
        name: "nasBays", 
        placeholder: "Ingresa la cantidad de bahías" 
      },
      { 
        label: "Soporte RAID", 
        name: "nasRAID", 
        placeholder: "Ingresa los niveles RAID soportados" 
      },
      { 
        label: "Procesador", 
        name: "processor", 
        placeholder: "Ingresa el procesador del NAS" 
      },
      { 
        label: "Memoria RAM", 
        name: "memory", 
        placeholder: "Ingresa la memoria RAM del NAS" 
      },
      { 
        label: "Conectividad", 
        name: "nasConnectivity", 
        placeholder: "Ingresa las opciones de conectividad" 
      }
    ],
    // Impresoras
    impresoras_laser: [
      { 
        label: "Tipo", 
        name: "printerType", 
        placeholder: "Ingresa el tipo de impresora" 
      },
      { 
        label: "Resolución", 
        name: "printerResolution", 
        placeholder: "Ingresa la resolución" 
      },
      { 
        label: "Velocidad", 
        name: "printerSpeed", 
        placeholder: "Ingresa la velocidad de impresión" 
      },
      { 
        label: "Impresión Dúplex", 
        name: "printerDuplex", 
        placeholder: "¿Cuenta con impresión dúplex?" 
      },
      { 
        label: "Conectividad", 
        name: "printerConnectivity", 
        placeholder: "Ingresa las opciones de conectividad" 
      },
      { 
        label: "Capacidad de Bandeja", 
        name: "printerTrayCapacity", 
        placeholder: "Ingresa la capacidad de la bandeja" 
      }
    ],
    impresoras_multifuncion: [
      { 
        label: "Tipo", 
        name: "printerType", 
        placeholder: "Ingresa el tipo de impresora" 
      },
      { 
        label: "Funciones", 
        name: "printerFunctions", 
        placeholder: "Ingresa las funciones (impresión, escaneo, etc.)" 
      },
      { 
        label: "Resolución", 
        name: "printerResolution", 
        placeholder: "Ingresa la resolución" 
      },
      { 
        label: "Velocidad", 
        name: "printerSpeed", 
        placeholder: "Ingresa la velocidad de impresión" 
      },
      { 
        label: "Impresión Dúplex", 
        name: "printerDuplex", 
        placeholder: "¿Cuenta con impresión dúplex?" 
      },
      { 
        label: "Conectividad", 
        name: "printerConnectivity", 
        placeholder: "Ingresa las opciones de conectividad" 
      },
      { 
        label: "Display", 
        name: "printerDisplay", 
        placeholder: "Ingresa el tipo de display" 
      }
    ],
    // Accesorios
    fuentes_alimentacion: [
      { 
        label: "Vataje", 
        name: "psuWattage", 
        placeholder: "Ingresa el vataje" 
      },
      { 
        label: "Eficiencia", 
        name: "psuEfficiency", 
        placeholder: "Ingresa la certificación de eficiencia" 
      },
      { 
        label: "Modular", 
        name: "psuModular", 
        placeholder: "Ingresa si es modular, semi-modular o no-modular" 
      },
      { 
        label: "Factor de Forma", 
        name: "psuFormFactor", 
        placeholder: "Ingresa el factor de forma (ATX, SFX, etc.)" 
      },
      { 
        label: "Protecciones", 
        name: "psuProtections", 
        placeholder: "Ingresa las protecciones que ofrece" 
      }
    ],
    ups: [
      { 
        label: "Capacidad", 
        name: "upsCapacity", 
        placeholder: "Ingresa la capacidad en VA" 
      },
      { 
        label: "Potencia de Salida", 
        name: "upsOutputPower", 
        placeholder: "Ingresa la potencia de salida en W" 
      },
      { 
        label: "Tiempo de Respaldo", 
        name: "upsBackupTime", 
        placeholder: "Ingresa el tiempo de respaldo promedio" 
      },
      { 
        label: "Número de Tomas", 
        name: "upsOutlets", 
        placeholder: "Ingresa el número de tomas" 
      },
      { 
        label: "Tipo de UPS", 
        name: "upsType", 
        placeholder: "Ingresa el tipo de UPS (En línea, Interactivo, etc.)" 
      },
      { 
        label: "Conectividad", 
        name: "upsConnectivity", 
        placeholder: "Ingresa las opciones de conectividad" 
      }
    ],
    airpods: [
      { 
        label: "Modelo", 
        name: "airpodsModel", 
        placeholder: "Ingresa el modelo" 
      },
      { 
        label: "Duración de Batería", 
        name: "airpodsBatteryLife", 
        placeholder: "Ingresa la duración de la batería" 
      },
      { 
        label: "Tipo de Carga", 
        name: "airpodsCharging", 
        placeholder: "Ingresa el tipo de carga" 
      },
      { 
        label: "Resistencia", 
        name: "airpodsResistance", 
        placeholder: "Ingresa el nivel de resistencia (agua, polvo)" 
      },
      { 
        label: "Características Adicionales", 
        name: "airpodsFeatures", 
        placeholder: "Ingresa características adicionales" 
      }
    ],
    // Software y Licencias
    licencias: [
      { 
        label: "Tipo de Licencia", 
        name: "softwareLicenseType", 
        placeholder: "Ingresa el tipo de licencia" 
      },
      { 
        label: "Duración", 
        name: "softwareLicenseDuration", 
        placeholder: "Ingresa la duración de la licencia" 
      },
      { 
        label: "Cantidad de Usuarios", 
        name: "softwareLicenseQuantity", 
        placeholder: "Ingresa la cantidad de usuarios permitidos" 
      },
      { 
        label: "Versión", 
        name: "softwareVersion", 
        placeholder: "Ingresa la versión del software" 
      },
      { 
        label: "Características", 
        name: "softwareFeatures", 
        placeholder: "Ingresa las características principales" 
      }
    ],
    // Telefonía
    telefonos_moviles: [
      { 
        label: "Tipo", 
        name: "phoneType", 
        placeholder: "Ingresa el tipo de teléfono" 
      },
      { 
        label: "Tamaño de Pantalla", 
        name: "phoneScreenSize", 
        placeholder: "Ingresa el tamaño de pantalla" 
      },
      { 
        label: "Sistema Operativo", 
        name: "operatingSystem", 
        placeholder: "Ingresa el sistema operativo" 
      },
      { 
        label: "Memoria RAM", 
        name: "phoneRAM", 
        placeholder: "Ingresa la memoria RAM" 
      },
      { 
        label: "Almacenamiento", 
        name: "phoneStorage", 
        placeholder: "Ingresa la capacidad de almacenamiento" 
      },
      { 
        label: "Procesador", 
        name: "phoneProcessor", 
        placeholder: "Ingresa el procesador" 
      },
      { 
        label: "Cámaras", 
        name: "phoneCameras", 
        placeholder: "Ingresa especificaciones de cámara" 
      },
      { 
        label: "Batería", 
        name: "phoneBattery", 
        placeholder: "Ingresa la capacidad de batería" 
      },
      { 
        label: "Sistema Operativo", 
        name: "phoneOS", 
        placeholder: "Ingresa el sistema operativo y versión" 
      }
    ],
    telefonos_fijos: [
      { 
        label: "Tipo", 
        name: "landlineType", 
        placeholder: "Ingresa el tipo de teléfono" 
      },
      { 
        label: "Tecnología", 
        name: "landlineTechnology", 
        placeholder: "Ingresa la tecnología (Digital, IP, etc.)" 
      },
      { 
        label: "Pantalla", 
        name: "landlineDisplay", 
        placeholder: "Ingresa el tipo de pantalla" 
      },
      { 
        label: "Funciones", 
        name: "landlineFunctions", 
        placeholder: "Ingresa las funciones principales" 
      },
      { 
        label: "Capacidad de Auriculares", 
        name: "landlineHandsets", 
        placeholder: "Ingresa la cantidad de auriculares" 
      }
    ]
  };

  // Obtener las especificaciones para la subcategoría actual
  const specifications = specificationsMap[subcategory] || [];

  // Si no hay especificaciones para esta subcategoría, no renderizar nada
  if (specifications.length === 0) return null;

  return (
    <>
      {specifications.map((spec) => (
        <React.Fragment key={spec.name}>
          <label htmlFor={spec.name} className="mt-3">{spec.label}:</label>
          <input
            type="text"
            id={spec.name}
            name={spec.name}
            placeholder={spec.placeholder}
            value={data[spec.name] || ""}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
          />
        </React.Fragment>
      ))}
    </>
  );
};

export default ProductSpecifications;