/**
 * updateOrderStatus.js
 * Siparişin durumunu günceller ve statü geçmişini `OrderStatusHistory` koleksiyonunda saklar.
 * Değişikliği yapan kullanıcının ID'sini kontrol eder ve kaydeder.
 */

const Order = require('../../models/orderModel');
const OrderStatusHistory = require('../../models/orderStatusHistory');

async function updateOrderStatus(req, res) {
    try {
        const { orderId, newStatus } = req.body;
        const userId = req.user ? req.user._id : null;

        if (!userId) {
            return res.status(401).json({ error: 'Kullanıcı kimliği doğrulanamadı.' });
        }

        const validStatuses = [
            'created', 'processing', 'awaiting_shipment',
            'shipped', 'awaiting_payment', 'paid', 'canceled', 'delivered'
        ];

        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({ error: 'Geçersiz sipariş durumu. Lütfen geçerli bir durum girin.' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Sipariş bulunamadı.' });
        }

        order.status = newStatus;
        await order.save();

        const statusHistory = new OrderStatusHistory({
            orderId: order._id,
            status: newStatus,
            userId: userId,
            description: `Statü ${newStatus} olarak güncellendi.`
        });
        await statusHistory.save();

        res.status(200).json({
            message: 'Sipariş durumu başarıyla güncellendi.',
            currentStatus: newStatus
        });
    } catch (error) {
        res.status(500).json({ error: `İşlem sırasında bir hata oluştu: ${error.message}` });
    }
}

module.exports = updateOrderStatus;
