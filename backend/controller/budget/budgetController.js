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
// Implementación completa para la función generateBudgetPDF en budgetController.js

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
  
      // Configuración de fuentes y colores
      const primaryColor = '#0047AB'; // Azul corporativo
      
      // Encabezado
      doc.fontSize(20).fillColor(primaryColor).text('PRESUPUESTO', { align: 'center' });
      doc.fontSize(12).fillColor('#333333').text(`Nº ${budget.budgetNumber}`, { align: 'center' });
      doc.moveDown(1);
      
      // Información de la empresa (Puedes reemplazar con los datos reales de tu empresa)
      doc.fontSize(14).fillColor(primaryColor).text('TU EMPRESA, S.L.', { align: 'left' });
      doc.fontSize(10).fillColor('#333333').text('Dirección de la empresa');
      doc.text('Teléfono: +1 234 567 890');
      doc.text('Email: info@tuempresa.com');
      doc.text('NIF: B-12345678');
      doc.moveDown(1);
      
      // Información del cliente
      doc.fontSize(14).fillColor(primaryColor).text('CLIENTE', { align: 'left' });
      doc.fontSize(10).fillColor('#333333').text(`${budget.client.name}`);
      if (budget.client.company) doc.text(`${budget.client.company}`);
      if (budget.client.address) {
        if (typeof budget.client.address === 'object') {
          // Si la dirección es un objeto con campos separados
          const { street, city, state, zip, country } = budget.client.address;
          if (street) doc.text(street);
          let locationLine = '';
          if (city) locationLine += city;
          if (state) locationLine += locationLine ? `, ${state}` : state;
          if (zip) locationLine += locationLine ? ` ${zip}` : zip;
          if (locationLine) doc.text(locationLine);
          if (country) doc.text(country);
        } else {
          // Si la dirección es un string
          doc.text(budget.client.address);
        }
      }
      if (budget.client.phone) doc.text(`Teléfono: ${budget.client.phone}`);
      if (budget.client.email) doc.text(`Email: ${budget.client.email}`);
      if (budget.client.taxId) doc.text(`NIF/CIF: ${budget.client.taxId}`);
      doc.moveDown(1);
      
      // Información del presupuesto
      doc.fontSize(12).fillColor(primaryColor).text('DETALLES DEL PRESUPUESTO', { align: 'left' });
      doc.fontSize(10).fillColor('#333333').text(`Fecha: ${new Date(budget.createdAt).toLocaleDateString()}`);
      doc.text(`Válido hasta: ${new Date(budget.validUntil).toLocaleDateString()}`);
      doc.text(`Estado: ${budget.status.toUpperCase()}`);
      if (budget.paymentTerms) doc.text(`Condiciones de pago: ${budget.paymentTerms}`);
      if (budget.deliveryMethod) doc.text(`Método de entrega: ${budget.deliveryMethod}`);
      doc.moveDown(1);
      
      // Tabla de productos
      doc.fontSize(12).fillColor(primaryColor).text('PRODUCTOS Y SERVICIOS', { align: 'left' });
      doc.moveDown(0.5);
      
      // Encabezados de la tabla
      const tableTop = doc.y;
      const tableConfig = {
        headers: [
          { label: 'Descripción', property: 'name', width: 200 },
          { label: 'Cant.', property: 'quantity', width: 40, align: 'center' },
          { label: 'Precio', property: 'unitPrice', width: 70, align: 'right' },
          { label: 'Dto.', property: 'discount', width: 40, align: 'center' },
          { label: 'Importe', property: 'subtotal', width: 80, align: 'right' }
        ],
        rows: []
      };
  
      // Llenar datos de la tabla
      budget.items.forEach(item => {
        const name = item.productSnapshot ? item.productSnapshot.name : 'Producto';
        tableConfig.rows.push({
          name,
          quantity: item.quantity.toString(),
          unitPrice: item.unitPrice.toLocaleString('es-ES', { style: 'currency', currency: 'PYG' }),
          discount: item.discount ? `${item.discount}%` : '0%',
          subtotal: item.subtotal.toLocaleString('es-ES', { style: 'currency', currency: 'PYG' })
        });
      });
  
      // Dibujar encabezados
      doc.fontSize(8).fillColor('#666666');
      
      let xPos = 50; // Posición inicial x (margen izquierdo)
      tableConfig.headers.forEach(header => {
        const textOptions = { width: header.width };
        if (header.align) {
          textOptions.align = header.align;
        }
        doc.text(header.label, xPos, tableTop, textOptions);
        xPos += header.width + 10; // +10 para espacio entre columnas
      });
  
      // Línea bajo los encabezados
      doc.strokeColor('#CCCCCC')
         .lineWidth(1)
         .moveTo(50, tableTop + 15)
         .lineTo(550, tableTop + 15)
         .stroke();
  
      // Dibujar filas
      let yPos = tableTop + 25;
      
      tableConfig.rows.forEach((row, rowIndex) => {
        // Verificar si necesitamos una nueva página
        if (yPos > 700) {
          doc.addPage();
          yPos = 50; // Reiniciar posición Y en la nueva página
        }
        
        doc.fontSize(8).fillColor('#333333');
        
        xPos = 50;
        tableConfig.headers.forEach(header => {
          const value = row[header.property];
          const textOptions = { width: header.width };
          if (header.align) {
            textOptions.align = header.align;
          }
          doc.text(value || '', xPos, yPos, textOptions);
          xPos += header.width + 10;
        });
        
        yPos += 20;
        
        // Línea divisoria entre filas
        if (rowIndex < tableConfig.rows.length - 1) {
          doc.strokeColor('#EEEEEE')
             .lineWidth(0.5)
             .moveTo(50, yPos - 10)
             .lineTo(550, yPos - 10)
             .stroke();
        }
      });
  
      // Línea final de la tabla
      doc.strokeColor('#CCCCCC')
         .lineWidth(1)
         .moveTo(50, yPos - 10)
         .lineTo(550, yPos - 10)
         .stroke();
      
      // Resumen de totales (a la derecha)
      yPos += 10;
      const totalStartX = 380;
      
      doc.fontSize(8).fillColor('#666666').text('Subtotal:', totalStartX, yPos, { width: 80, align: 'right' });
      doc.fontSize(8).fillColor('#333333').text(budget.totalAmount.toLocaleString('es-ES', { style: 'currency', currency: 'PYG' }), totalStartX + 90, yPos, { width: 80, align: 'right' });
      
      yPos += 15;
      if (budget.discount > 0) {
        doc.fontSize(8).fillColor('#666666').text(`Descuento (${budget.discount}%):`, totalStartX, yPos, { width: 80, align: 'right' });
        const discountAmount = budget.totalAmount * (budget.discount / 100);
        doc.fontSize(8).fillColor('#333333').text('-' + discountAmount.toLocaleString('es-ES', { style: 'currency', currency: 'PYG' }), totalStartX + 90, yPos, { width: 80, align: 'right' });
        yPos += 15;
      }
      
      if (budget.tax > 0) {
        doc.fontSize(8).fillColor('#666666').text(`IVA (${budget.tax}%):`, totalStartX, yPos, { width: 80, align: 'right' });
        const taxAmount = (budget.totalAmount - budget.totalAmount * (budget.discount / 100)) * (budget.tax / 100);
        doc.fontSize(8).fillColor('#333333').text(taxAmount.toLocaleString('es-ES', { style: 'currency', currency: 'PYG' }), totalStartX + 90, yPos, { width: 80, align: 'right' });
        yPos += 15;
      }
      
      // Línea divisoria para el total final
      doc.strokeColor('#CCCCCC')
         .lineWidth(1)
         .moveTo(totalStartX, yPos)
         .lineTo(550, yPos)
         .stroke();
      
      yPos += 10;
      doc.fontSize(10).fillColor(primaryColor).text('TOTAL:', totalStartX, yPos, { width: 80, align: 'right' });
      doc.fontSize(10).fillColor(primaryColor).text(budget.finalAmount.toLocaleString('es-ES', { style: 'currency', currency: 'PYG' }), totalStartX + 90, yPos, { width: 80, align: 'right' });
      
      // Notas y condiciones
      yPos += 40;
      if (budget.notes) {
        doc.fontSize(10).fillColor(primaryColor).text('NOTAS:', 50, yPos);
        doc.fontSize(8).fillColor('#333333').text(budget.notes, 50, yPos + 15, { width: 500 });
      }
      
      // Pie de página
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        
        // Posición del pie: parte inferior de la página
        const footerY = doc.page.height - 50;
        
        doc.fontSize(8).fillColor('#999999').text(
          `Este presupuesto ha sido generado por ${budget.createdBy ? budget.createdBy.name : 'un administrador'} | Página ${i + 1} de ${pageCount}`,
          50, footerY, { align: 'center', width: 500 }
        );
      }
  
      // Finalizar el PDF
      doc.pipe(pdfStream);
      doc.end();
      
      return new Promise((resolve, reject) => {
        pdfStream.on('finish', async () => {
          try {
            // Registrar la ruta del archivo en el presupuesto
            budget.pdfPath = pdfPath;
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