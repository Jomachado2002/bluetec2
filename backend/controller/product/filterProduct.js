const productModel = require("../../models/productModel");

const filterProductController = async (req, res) => {
  try {
    const { 
      category = [], 
      subcategory = [], 
      brandName = [],
      specifications = {} 
    } = req.body;

    let query = {};

    // Filtros básicos
    if (category.length > 0) query.category = { $in: category };
    if (subcategory.length > 0) query.subcategory = { $in: subcategory };
    if (brandName.length > 0) query.brandName = { $in: brandName };

    // Mapeo de especificaciones por subcategoría
    const specificationMappings = {
      notebooks: [
        'processor', 'memory', 'storage', 'disk', 
        'graphicsCard', 'notebookScreen', 'notebookBattery'
      ],
      computadoras_ensambladas: [
        'processor', 'memory', 'storage', 'graphicsCard', 
        'pcCase', 'pcPowerSupply', 'pcCooling'
      ],
      monitores: [
        'monitorSize', 'monitorRefreshRate'
      ],
      camaras_seguridad: [
        'cameraResolution', 'cameraLensType', 'cameraIRDistance'
      ],
      dvr: [
        'dvrChannels', 'dvrResolution', 'dvrStorageCapacity'
      ],
      // Agrega más subcategorías según necesites
    };

    // Filtros por especificaciones
    if (Object.keys(specifications).length > 0) {
      for (const [key, values] of Object.entries(specifications)) {
        if (values.length > 0) {
          query[key] = { $in: values };
        }
      }
    }

    // Buscar productos según el filtro
    const products = await productModel.find(query);

    // Preparar filtros disponibles
    const filters = {
      brands: [],
      specifications: {}
    };

    if (subcategory.length > 0) {
      const subcategoryQuery = { subcategory: { $in: subcategory } };
      
      // Obtener marcas disponibles
      filters.brands = await productModel.distinct("brandName", subcategoryQuery);

      // Obtener especificaciones para la subcategoría
      const currentSubcategory = subcategory[0];
      const relevantSpecs = specificationMappings[currentSubcategory] || [];

      // Recolectar valores únicos para cada especificación
      relevantSpecs.forEach(specKey => {
        const specValues = products
          .map(product => product[specKey])
          .filter(value => value != null && value !== '');

        if (specValues.length > 0) {
          filters.specifications[specKey] = [...new Set(specValues)];
        }
      });
    }

    res.json({
      data: products,
      filters,
      message: "Productos filtrados correctamente",
      success: true,
      error: false
    });

  } catch (err) {
    console.error('Error en filterProductController:', err);
    res.status(500).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
};

module.exports = filterProductController;