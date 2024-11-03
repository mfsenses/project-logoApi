/**
 * orderModel.js
 * Sipariş modeli, sipariş bilgilerini, ürün detaylarını, KDV ve toplamları içerir.
 * Siparişin tüm süreçleri ve durum geçişleri kaydedilir.
 * Müşteri ve not alanları eklenmiştir.
 */

const mongoose = require('mongoose');

const orderStatusEnum = [
    'created', 
    'processing', 
    'awaiting_shipment', 
    'shipped', 
    'awaiting_payment', 
    'paid', 
    'canceled', 
    'delivered'
];

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: false, default: null },
    note: { type: String, default: '' }, // Siparişe not ekleme alanı
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            discount: { type: Number, default: 0 },
            VAT: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    discountTotal: { type: Number, required: true },
    totalAmountAfterDiscount: { type: Number, required: true },
    VATAmount: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    createdDate: { type: Date, default: Date.now },
    status: { type: String, enum: orderStatusEnum, default: 'created' },
    statusHistory: [
        {
            status: { type: String, enum: orderStatusEnum },
            date: { type: Date, default: Date.now }
        }
    ]
});

orderSchema.pre('save', function(next) {
    // Sipariş durumu güncellendiğinde, durumu geçmişe ekle
    if (this.isModified('status')) {
        this.statusHistory.push({ status: this.status });
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
