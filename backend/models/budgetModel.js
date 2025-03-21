// backend/models/budgetModel.js
const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    budgetNumber: {
        type: String,
        required: true,
        unique: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
        productSnapshot: {
            name: String,
            price: Number,
            description: String,
            category: String,
            subcategory: String,
            brandName: String
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        unitPrice: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            default: 0
        },
        subtotal: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    finalAmount: {
        type: Number,
        required: true
    },
    notes: String,
    validUntil: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'accepted', 'rejected', 'expired', 'converted'],
        default: 'draft'
    },
    paymentTerms: {
        type: String
    },
    deliveryMethod: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    // En backend/models/budgetModel.js, modifica el campo pdfUrl por pdfPath
        pdfPath: {
            type: String
        }
}, {
    timestamps: true
});

// Generar automáticamente el número de presupuesto
budgetSchema.pre('save', async function(next) {
    if (!this.budgetNumber) {
        try {
            const lastBudget = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
            
            if (lastBudget && lastBudget.budgetNumber) {
                // Extraer la parte numérica del último presupuesto
                const lastNumber = parseInt(lastBudget.budgetNumber.split('-')[1]);
                this.budgetNumber = `PRES-${(lastNumber + 1).toString().padStart(5, '0')}`;
            } else {
                // Primer presupuesto
                this.budgetNumber = 'PRES-00001';
            }
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const budgetModel = mongoose.model("budget", budgetSchema);
module.exports = budgetModel;