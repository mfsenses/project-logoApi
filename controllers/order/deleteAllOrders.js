/**
 * deleteAllOrders.js
 * Tüm siparişleri silmek için kullanılan işlev.
 * Tüm sipariş kayıtlarını veritabanından temizler.
 */

const Order = require('../../models/orderModel');

async function deleteAllOrders(req, res) {
    try {
        await Order.deleteMany({});
        res.status(200).json({ message: 'Tüm siparişler başarıyla silindi' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = deleteAllOrders;
