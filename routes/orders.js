/**
 * orders.js
 * Sipariş işlemleri için rotaları tanımlar: sipariş oluşturma, görüntüleme, iptal etme, güncelleme ve statü geçmişi.
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const createOrder = require('../controllers/order/createOrder');
const viewOrder = require('../controllers/order/viewOrder');
const cancelOrder = require('../controllers/order/cancelOrder');
const updateOrderStatus = require('../controllers/order/updateOrderStatus');
const updateOrder = require('../controllers/order/updateOrder');
const deleteOrder = require('../controllers/order/deleteOrder');
const deleteAllOrders = require('../controllers/order/deleteAllOrders');

router.post('/create', authenticateToken, createOrder);
router.get('/view', authenticateToken, viewOrder);
router.delete('/cancel', authenticateToken, cancelOrder);
router.post('/update-status', authenticateToken, updateOrderStatus);
router.put('/update', authenticateToken, updateOrder);
router.delete('/delete', authenticateToken, deleteOrder);
router.delete('/delete-all', authenticateToken, deleteAllOrders);

module.exports = router;
