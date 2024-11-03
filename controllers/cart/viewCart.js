/**
 * viewCart.js
 * Sepeti görüntülemek için kullanılan işlev.
 * Sepetteki ürünleri, toplam tutarı, KDV ve iskonto bilgilerini belirli bir formatta döndürür.
 */

const Cart = require('../../models/cartModel');
const calculateCartTotals = require('./calculateCartTotals');

async function viewCart(req, res) {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId }).populate('items.productId', 'productCode productName barcode');

        if (!cart) {
            return res.status(404).json({ error: 'Sepet bulunamadı' });
        }

        await calculateCartTotals(cart);

        const formattedCart = {
            totalAmount: `${(cart.totalAmount || 0).toFixed(2)} TL`,
            discountTotal: `${(cart.discountTotal || 0).toFixed(2)} TL`,
            totalAmountAfterDiscount: `${(cart.totalAmountAfterDiscount || 0).toFixed(2)} TL`,
            VATAmount: `${(cart.VATAmount || 0).toFixed(2)} TL`,
            grandTotal: `${(cart.grandTotal || 0).toFixed(2)} TL`,
            items: cart.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: `${item.price.toFixed(2)} TL`,
                discount: item.discount,
                VAT: item.VAT
            }))
        };

        res.status(200).json(formattedCart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = viewCart;
