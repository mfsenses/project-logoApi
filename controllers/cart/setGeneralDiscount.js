/**
 * setGeneralDiscount.js
 * Sepete genel indirim uygulamak için kullanılan işlev.
 */

const Cart = require('../../models/cartModel');
const calculateCartTotals = require('./calculateCartTotals');

async function setGeneralDiscount(req, res) {
    try {
        const { discount } = req.body;
        const userId = req.user._id; // Kullanıcı kimliğini doğru şekilde al

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Sepet bulunamadı' });
        }

        cart.generalDiscount = discount;
        await calculateCartTotals(cart);
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = setGeneralDiscount;
