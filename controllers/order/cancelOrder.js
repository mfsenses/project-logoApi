/**
 * cancelOrder.js
 * Siparişi iptal etmek için kullanılan işlev.
 * `orderId` bilgisini body'den alır ve siparişi iptal eder.
 */

const Order = require('../../models/orderModel');

async function cancelOrder(req, res) {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: 'Sipariş bulunamadı' });
        }

        order.status = 'canceled';
        await order.save();
        res.status(200).json({ message: 'Sipariş iptal edildi', order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = cancelOrder;
