/**
 * applyDiscountToItem.js
 * Sepetteki tek bir ürüne indirim uygulamak için kullanılan işlev.
 * Ürüne indirim ekler ve toplamları yeniden hesaplar.
 */

const Cart = require('../../models/cartModel');
const calculateCartTotals = require('./calculateCartTotals');

async function applyDiscountToItem(req, res) {
    try {
        const { productId, discount } = req.body;
        const userId = req.user.userId;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Sepette bu ürün bulunamadı' });
        }

        const existingItem = cart.items.find(item => item.productId.equals(productId));
        if (existingItem) {
            existingItem.discount = discount;
        } else {
            return res.status(404).json({ error: 'Sepette bu ürün bulunamadı' });
        }

        await calculateCartTotals(cart);
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = applyDiscountToItem;
