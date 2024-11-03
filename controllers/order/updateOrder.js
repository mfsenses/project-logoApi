/**
 * updateOrder.js
 * Siparişi güncellemek için kullanılan işlev.
 * Müşteri ID ve not bilgilerini günceller.
 */

const Order = require('../../models/orderModel');
const Customer = require('../../models/customerModel');

async function updateOrder(req, res) {
    try {
        const { orderId, customerId, note } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Sipariş bulunamadı' });
        }

        if (customerId) {
            const customerExists = await Customer.exists({ _id: customerId });
            if (!customerExists) {
                return res.status(400).json({ error: 'Geçersiz müşteri ID’si' });
            }
            order.customerId = customerId;
        }

        if (note) {
            order.note = note;
        }

        await order.save();
        res.status(200).json({ message: 'Sipariş güncellendi', order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = updateOrder;
