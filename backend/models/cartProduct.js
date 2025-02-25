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
        min: 1
    },
    userId: {
        type: String,
        required: true
    },
    isGuest: {
        type: Boolean,
        default: false
    },
    sessionId: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Índices para mejorar el rendimiento
addToCartSchema.index({ userId: 1, productId: 1 }, { unique: true });
addToCartSchema.index({ sessionId: 1 });

const addToCartModel = mongoose.model("addToCart", addToCartSchema);

module.exports = addToCartModel;