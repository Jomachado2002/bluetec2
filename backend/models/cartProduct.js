const mongoose = require('mongoose');

const addToCartSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1,
        max: 100 // Añadir un límite máximo de cantidad
    },
    userId: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // Eliminar después de 1 hora (3600 segundos)
    },
    isGuest: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true 
});

// Índice TTL para eliminar carritos después de 1 hora
addToCartSchema.index({ createdAt: 1 }, { 
    expireAfterSeconds: 3600,
    background: true 
});

// Índices compuestos para consultas más eficientes
addToCartSchema.index({ userId: 1, productId: 1 });
addToCartSchema.index({ sessionId: 1, productId: 1 });

// Índice único para prevenir duplicados por usuario/sesión y producto
addToCartSchema.index({ userId: 1, productId: 1 }, { unique: true });
addToCartSchema.index({ sessionId: 1, productId: 1 }, { unique: true });

const addToCartModel = mongoose.model("addToCart", addToCartSchema);

module.exports = addToCartModel;