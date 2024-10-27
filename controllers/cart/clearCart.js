/**
 * clearCart.js
 * Sepeti tamamen boşaltmak ve genel indirimi sıfırlamak için kullanılan işlev.
 * Sepeti boşaltır ve tüm değerleri sıfırlar.
 */

const Cart = require('../../models/cartModel');

async function clearCart(req, res) {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Sepet bulunamadı' });
        }

        cart.items = [];
        cart.totalAmount = 0;
        cart.discountTotal = 0;
        cart.totalAmountAfterDiscount = 0;
        cart.VATAmount = 0;
        cart.grandTotal = 0;
        cart.generalDiscount = 0;
        await cart.save();
        res.status(200).json({ message: 'Sepet ve genel indirim başarıyla sıfırlandı' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = clearCart;
