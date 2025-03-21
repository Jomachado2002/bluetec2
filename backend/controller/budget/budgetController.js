// backend/controller/budget/budgetController.js
const BudgetModel = require('../../models/budgetModel');
const ClientModel = require('../../models/clientModel');
const ProductModel = require('../../models/productModel');
const uploadProductPermission = require('../../helpers/permission');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { uploadTempFile } = require('../../helpers/uploadImage'); // Necesitaremos adaptar esta función

/**
 * Crea un nuevo presupuesto
 */
async function createBudgetController(req, res) {
    try {
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Permiso denegado");
        }

        const { 
            clientId,
            items,
            totalAmount,
            discount,
            tax,
            finalAmount,
            notes,
            validUntil,
            paymentTerms,
            deliveryMethod
        } = req.body;

        // Validar cliente
        if (!clientId) {
            throw new Error("ID de cliente no proporcionado");
        }

        const client = await ClientModel.findById(clientId);
        if (!client) {
            throw new Error("Cliente no encontrado");
        }

        // Validar items
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new Error("El presupuesto debe contener al menos un producto");
        }

        // Procesar y validar cada item
        const processedItems = [];
        for (const item of items) {
            if (!item.product && !item.productSnapshot) {
                throw new Error("Cada item debe contener un producto o un snapshot");
            }

            if (item.product) {
                const product = await ProductModel.findById(item.product);
                if (!product) {
                    throw new Error(`Producto no encontrado: ${item.product}`);
                }

                // Calcular subtotal
                const quantity = Number(item.quantity) || 1;
                const unitPrice = Number(item.unitPrice) || product.sellingPrice;
                const itemDiscount = Number(item.discount) || 0;
                const subtotal = quantity * unitPrice * (1 - itemDiscount / 100);

                processedItems.push({
                    product: product._id,
                    productSnapshot: {
                        name: product.productName,
                        price: product.sellingPrice,
                        description: product.description,
                        category: product.category,
                        subcategory: product.subcategory,
                        brandName: product.brandName
                    },
                    quantity,
                    unitPrice,
                    discount: itemDiscount,
                    subtotal
                });
            } else {
                // Si ya viene un snapshot, validamos que tenga lo necesario
                if (!item.productSnapshot.name || !item.quantity || !item.unitPrice) {
                    throw new Error("Los datos del producto personalizado son incompletos");
                }

                const quantity = Number(item.quantity) || 1;
                const unitPrice = Number(item.unitPrice);
                const itemDiscount = Number(item.discount) || 0;
                const subtotal = quantity * unitPrice * (1 - itemDiscount / 100);

                processedItems.push({
                    productSnapshot: item.productSnapshot,
                    quantity,
                    unitPrice,
                    discount: itemDiscount,
                    subtotal
                });
            }
        }

        // Calcular importes totales
        const calculatedTotalAmount = processedItems.reduce((sum, item) => sum + item.subtotal, 0);
        const calculatedDiscount = Number(discount) || 0;
        const calculatedTax = Number(tax) || 0;
        const calculatedFinalAmount = calculatedTotalAmount * (1 - calculatedDiscount / 100) * (1 + calculatedTax / 100);

        // Crear nuevo presupuesto
        const newBudget = new BudgetModel({
            client: clientId,
            items: processedItems,
            totalAmount: calculatedTotalAmount,
            discount: calculatedDiscount,
            tax: calculatedTax,
            finalAmount: calculatedFinalAmount,
            notes,
            validUntil: validUntil || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 días por defecto
            paymentTerms,
            deliveryMethod,
            createdBy: req.userId
        });

        const savedBudget = await newBudget.save();

        // Asociar presupuesto al cliente
        await ClientModel.findByIdAndUpdate(
            clientId,
            { $push: { budgets: savedBudget._id } }
        );

        // Generar PDF del presupuesto (implementaremos esta función después)
        await generateBudgetPDF(savedBudget._id);

        res.status(201).json({
            message: "Presupuesto creado correctamente",
            data: savedBudget,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

/**
 * Obtiene todos los presupuestos
 */
async function getAllBudgetsController(req, res) {
    try {
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Permiso denegado");
        }

        const { 
            clientId, 
            status, 
            startDate, 
            endDate, 
            minAmount, 
            maxAmount,
            limit = 50, 
            page = 1, 
            sortBy = 'createdAt', 
            sortOrder = 'desc' 
        } = req.query;
        
        // Construir query
        const query = {};
        
        if (clientId) query.client = clientId;
        if (status) query.status = status;
        
        // Filtro por fecha
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }
        
        // Filtro por monto
        if (minAmount || maxAmount) {
            query.finalAmount = {};
            if (minAmount) query.finalAmount.$gte = Number(minAmount);
            if (maxAmount) query.finalAmount.$lte = Number(maxAmount);
        }
        
        // Ordenamiento
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        
        // Paginación
        const skip = (page - 1) * limit;
        
        // Ejecutar la consulta
        const budgets = await BudgetModel.find(query)
            .select('budgetNumber client items totalAmount discount tax finalAmount status validUntil createdAt')
            .populate('client', 'name email phone company')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));
            
        // Contar total de presupuestos para paginación
        const total = await BudgetModel.countDocuments(query);
        
        res.json({
            message: "Lista de presupuestos",
            data: {
                budgets,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    pages: Math.ceil(total / limit)
                }
            },
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

/**
 * Obtiene un presupuesto por su ID
 */
async function getBudgetByIdController(req, res) {
    try {
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Permiso denegado");
        }

        const { budgetId } = req.params;

        if (!budgetId) {
            throw new Error("ID de presupuesto no proporcionado");
        }

        const budget = await BudgetModel.findById(budgetId)
            .populate('client', 'name email phone company address taxId')
            .populate('items.product', 'productName brandName category subcategory sellingPrice');

        if (!budget) {
            throw new Error("Presupuesto no encontrado");
        }

        res.json({
            message: "Detalles del presupuesto",
            data: budget,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

/**
 * Actualiza el estado de un presupuesto
 */
async function updateBudgetStatusController(req, res) {
    try {
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Permiso denegado");
        }

        const { budgetId } = req.params;
        const { status } = req.body;

        if (!budgetId) {
            throw new Error("ID de presupuesto no proporcionado");
        }

        if (!['draft', 'sent', 'accepted', 'rejected', 'expired', 'converted'].includes(status)) {
            throw new Error("Estado de presupuesto no válido");
        }

        const budget = await BudgetModel.findById(budgetId);
        
        if (!budget) {
            throw new Error("Presupuesto no encontrado");
        }

        budget.status = status;
        
        // Si el estado es expired, pero la fecha de validez aún no ha llegado, actualizarla
        if (status === 'expired' && budget.validUntil > new Date()) {
            budget.validUntil = new Date();
        }

        const updatedBudget = await budget.save();

        res.json({
            message: `Estado del presupuesto actualizado a ${status}`,
            data: updatedBudget,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

/**
 * Genera el PDF de un presupuesto
 */
// En el controlador backend/controller/budget/budgetController.js

// Modificar la función generateBudgetPDF para que no guarde en Firebase
async function generateBudgetPDF(budgetId) {
    try {
      const budget = await BudgetModel.findById(budgetId)
        .populate('client', 'name email phone company address taxId')
        .populate('createdBy', 'name email');
      
      if (!budget) {
        throw new Error("Presupuesto no encontrado");
      }
  
      // Crear un documento PDF
      const doc = new PDFDocument({ margin: 50 });
      
      // Crear carpeta temporal si no existe
      const tempDir = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      // Ruta del archivo temporal
      const pdfPath = path.join(tempDir, `presupuesto-${budget.budgetNumber}.pdf`);
      const pdfStream = fs.createWriteStream(pdfPath);
  
      // [Mantener todo el código de generación del PDF...]
  
      // Finalizar el PDF
      doc.pipe(pdfStream);
      doc.end();
      
      return new Promise((resolve, reject) => {
        pdfStream.on('finish', async () => {
          try {
            // Registrar la ruta del archivo en el presupuesto (sin subirlo a Firebase)
            budget.pdfPath = pdfPath;  // Guardamos solo la ruta local
            await budget.save();
            
            resolve(pdfPath);
          } catch (error) {
            reject(error);
          }
        });
        
        pdfStream.on('error', reject);
      });
      
    } catch (error) {
      console.error('Error generando PDF de presupuesto:', error);
      throw error;
    }
  }
  
  // Modificar el controlador getBudgetPDFController para descargar el archivo local
  async function getBudgetPDFController(req, res) {
    try {
      if (!uploadProductPermission(req.userId)) {
        throw new Error("Permiso denegado");
      }
  
      const { budgetId } = req.params;
  
      if (!budgetId) {
        throw new Error("ID de presupuesto no proporcionado");
      }
  
      // Buscar el presupuesto
      const budget = await BudgetModel.findById(budgetId);
      if (!budget) {
        throw new Error("Presupuesto no encontrado");
      }
  
      // Si el PDF ya existe, enviarlo
      if (budget.pdfPath && fs.existsSync(budget.pdfPath)) {
        return res.download(budget.pdfPath, `presupuesto-${budget.budgetNumber}.pdf`);
      }
  
      // Si no existe, regenerar el PDF
      const pdfPath = await generateBudgetPDF(budgetId);
      
      // Enviar el archivo como descarga
      res.download(pdfPath, `presupuesto-${budget.budgetNumber}.pdf`);
  
    } catch (err) {
      res.status(400).json({
        message: err.message || err,
        error: true,
        success: false
      });
    }
  }

module.exports = {
    createBudgetController,
    getAllBudgetsController,
    getBudgetByIdController,
    updateBudgetStatusController,
    getBudgetPDFController
};