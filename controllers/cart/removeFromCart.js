/**
 * removeFromCart.js
 * Sepetten ürün çıkarmak için kullanılan işlev.
 * Belirli bir miktarda ürünü çıkarır veya miktar sıfırın altına düşerse ürünü tamamen kaldırır.
 * Sonrasında sepet toplamlarını yeniden hesaplar.
 */

const Cart = require('../../models/cartModel');
const calculateCartTotals = require('./calculateCartTotals');

async function removeFromCart(req, res) {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.userId;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Sepet bulunamadı' });
        }

        const existingItem = cart.items.find(item => item.productId.equals(productId));
        if (existingItem) {
            existingItem.quantity -= quantity;
            if (existingItem.quantity <= 0) {
                cart.items = cart.items.filter(item => !item.productId.equals(productId));
            }
        }

        await calculateCartTotals(cart);
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = removeFromCart;
