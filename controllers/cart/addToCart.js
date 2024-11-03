/**
 * addToCart.js
 * Sepete ürün eklemek için kullanılan işlev.
 * Ürünü sepete ekler, miktarı günceller ve toplamları hesaplar.
 */

const Cart = require('../../models/cartModel');
const Product = require('../../models/productModel');
const calculateCartTotals = require('./calculateCartTotals');

async function addToCart(req, res) {
    try {
        const { productId, quantity, discount } = req.body;
        const userId = req.user._id; // Doğru kullanıcı ID'sini al

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Ürün bulunamadı' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.productId.equals(productId));
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.discount = discount || existingItem.discount;
        } else {
            cart.items.push({
                productId,
                quantity,
                price: product.wholesalePrice,
                VAT: product.VAT,
                discount: discount || 0
            });
        }

        await calculateCartTotals(cart);
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: `Sepete ekleme sırasında bir hata oluştu: ${err.message}` });
    }
}

module.exports = addToCart;
