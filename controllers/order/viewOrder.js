/**
 * viewOrder.js
 * Kullanıcı veya yönetici tarafından siparişleri görüntülemek için kullanılan işlev.
 * Sipariş bilgilerini geri döndürür.
 */

const Order = require('../../models/orderModel');

async function viewOrder(req, res) {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ userId }).populate('items.productId customerId');
        
        if (!orders || orders.length === 0) {
            return res.status(404).json({ error: 'Sipariş bulunamadı' });
        }

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = viewOrder;
