const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Kullanıcı modelini içe aktar

// JWT doğrulama middleware'i
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token gerekli' });

    jwt.verify(token, 'secretkey', async (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Geçersiz token' });

        try {
            // Kullanıcıyı veritabanından bul ve `req.user` olarak ayarla
            const user = await User.findById(decoded.userId);
            if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

            req.user = user; // `req.user`'ı tam kullanıcı bilgileriyle ayarla
            next();
        } catch (error) {
            res.status(500).json({ error: `Kimlik doğrulama sırasında bir hata oluştu: ${error.message}` });
        }
    });
}

// Rol yetkilendirme middleware'i
function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Yetkiniz yok' });
        }
        next();
    };
}

module.exports = { authenticateToken, authorizeRoles };
