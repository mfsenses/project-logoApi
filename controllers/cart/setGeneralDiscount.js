/**
 * setGeneralDiscount.js
 * Sepete genel bir indirim uygulamak veya güncellemek için kullanılan işlev.
 * Genel indirimi ayarlar ve toplamları yeniden hesaplar.
 */

const Cart = require('../../models/cartModel');
const calculateCartTotals = require('./calculateCartTotals');

async function setGeneralDiscount(req, res) {
    try {
        const { generalDiscount } = req.body;
        const userId = req.user.userId;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Sepet bulunamadı' });
        }

        cart.generalDiscount = generalDiscount;
        await calculateCartTotals(cart);
        await cart.save();
        res.status(200).json({ message: 'Genel iskonto başarıyla uygulandı', cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = setGeneralDiscount;
