/**
 * deleteOrder.js
 * Belirli bir siparişi silmek için kullanılan işlev.
 * Gelen `orderId` parametresiyle ilgili siparişi siler.
 */

const Order = require('../../models/orderModel');

async function deleteOrder(req, res) {
    try {
        const { orderId } = req.body;
        const order = await Order.findByIdAndDelete(orderId);

        if (!order) {
            return res.status(404).json({ error: 'Sipariş bulunamadı' });
        }

        res.status(200).json({ message: 'Sipariş başarıyla silindi', order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = deleteOrder;
