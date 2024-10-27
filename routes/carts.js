const express = require('express');
const router = express.Router();
const addToCart = require('../controllers/cart/addToCart');
const removeFromCart = require('../controllers/cart/removeFromCart');
const clearCart = require('../controllers/cart/clearCart');
const viewCart = require('../controllers/cart/viewCart');
const setGeneralDiscount = require('../controllers/cart/setGeneralDiscount');
const applyDiscountToItem = require('../controllers/cart/applyDiscountToItem');
const { authenticateToken } = require('../middleware/auth');

router.post('/add', authenticateToken, addToCart);
router.post('/remove', authenticateToken, removeFromCart);
router.post('/clear', authenticateToken, clearCart);
router.get('/view', authenticateToken, viewCart);
router.post('/set-discount', authenticateToken, setGeneralDiscount);
router.post('/apply-item-discount', authenticateToken, applyDiscountToItem);

module.exports = router;
