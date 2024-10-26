const express = require('express');
const router = express.Router();
const { addUser, listUsers, updateUser, deleteUser } = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Kullanıcı ekleme (Sadece admin)
router.post('/add', authenticateToken, authorizeRoles('admin'), addUser);

// Kullanıcıları listeleme (Sadece admin)
router.get('/list', authenticateToken, authorizeRoles('admin'), listUsers);

// Kullanıcı güncelleme (Sadece admin)
router.put('/update/:id', authenticateToken, authorizeRoles('admin'), updateUser);

// Kullanıcı silme (Sadece admin)
router.delete('/delete/:id', authenticateToken, authorizeRoles('admin'), deleteUser);

module.exports = router;
