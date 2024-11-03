/**
 * orderStatusHistory.js
 * Siparişlerin statü geçmişini kaydetmek için kullanılan model.
 * Her siparişin statü değişikliklerini, değişikliği yapan kullanıcının ID'si ile birlikte tutar.
 */

const mongoose = require('mongoose');

const orderStatusHistorySchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Order' },
    status: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Değişikliği yapan kullanıcı
    date: { type: Date, default: Date.now },
    description: { type: String } // İsteğe bağlı açıklama
});

module.exports = mongoose.model('OrderStatusHistory', orderStatusHistorySchema);
