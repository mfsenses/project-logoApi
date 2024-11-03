/**
 * removeFromCart.js
 * Sepetten ürün çıkarmak için kullanılan işlev.
 */

const Cart = require('../../models/cartModel');

async function removeFromCart(req, res) {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id; // Kullanıcı kimliğini doğru şekilde al

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Sepet bulunamadı' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
        if (itemIndex === -1) {
            return res.status(404).json({ error: 'Ürün sepette bulunamadı' });
        }

        // Ürün miktarını düşür veya ürünü tamamen kaldır
        if (quantity && cart.items[itemIndex].quantity > quantity) {
            cart.items[itemIndex].quantity -= quantity;
        } else {
            cart.items.splice(itemIndex, 1);
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = removeFromCart;
