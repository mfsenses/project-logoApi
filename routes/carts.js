const express = require('express');
const router = express.Router();
const { addToCart, removeFromCart, clearCart, viewCart, setGeneralDiscount, applyDiscountToItem } = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');

// Sepete ürün ekleme
router.post('/add', authenticateToken, addToCart);

// Sepetten ürün çıkarma
router.post('/remove', authenticateToken, removeFromCart);

// Sepeti tamamen boşaltma
router.post('/clear', authenticateToken, clearCart);

// Sepeti görüntüleme
router.get('/view', authenticateToken, viewCart);

// Genel iskonto uygulama
router.post('/set-discount', authenticateToken, setGeneralDiscount);

// Mevcut ürüne iskonto uygulama
router.post('/apply-item-discount', authenticateToken, applyDiscountToItem); // Rota ekli

module.exports = router;
