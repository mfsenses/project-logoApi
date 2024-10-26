const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// Kullanıcı giriş
router.post('/login', login);

module.exports = router;
