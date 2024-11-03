/**
 * createOrder.js
 * Sepeti siparişe dönüştürmek için kullanılan işlev.
 * Sepet bilgilerini alır, sipariş olarak kaydeder ve toplamları hesaplar.
 * Müşteri ve not alanları eklenmiştir. Varsayılan müşteri adı atanır.
 */

const Cart = require('../../models/cartModel');
const Order = require('../../models/orderModel');
const Customer = require('../../models/customerModel');
const calculateCartTotals = require('../cart/calculateCartTotals');

const DEFAULT_CUSTOMER_ID = "000000000000000000000000";
const DEFAULT_CUSTOMER_NAME = "Bilinmeyen Müşteri";

async function createOrder(req, res) {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Sepet boş' });
        }

        await calculateCartTotals(cart);

        let customerId = req.body.customerId || DEFAULT_CUSTOMER_ID;
        let customerName = DEFAULT_CUSTOMER_NAME;

        if (customerId !== DEFAULT_CUSTOMER_ID) {
            const customer = await Customer.findById(customerId);
            if (!customer) {
                return res.status(400).json({ error: 'Geçersiz müşteri ID’si' });
            }
            customerName = customer.customerName;
        }

        const order = new Order({
            userId,
            customerId,
            customerName,
            note: req.body.note || '',
            items: cart.items,
            totalAmount: cart.totalAmount,
            discountTotal: cart.discountTotal,
            totalAmountAfterDiscount: cart.totalAmountAfterDiscount,
            VATAmount: cart.VATAmount,
            grandTotal: cart.grandTotal
        });

        await order.save();
        await Cart.deleteOne({ userId });
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = createOrder;
