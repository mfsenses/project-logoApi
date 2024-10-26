const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true }, // Birim fiyat
    discount: { type: Number, default: 0 }, // Ürün bazında iskonto
    VAT: { type: Number, required: true } // Ürünün KDV oranı
});

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [cartItemSchema],
    totalAmount: { type: Number, required: true, default: 0 }, // KDV hariç toplam
    VATAmount: { type: Number, required: true, default: 0 }, // Toplam KDV
    grandTotal: { type: Number, required: true, default: 0 }, // KDV dahil toplam
    generalDiscount: { type: Number, default: 0 }, // Genel iskonto
    createdDate: { type: Date, default: Date.now }
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
