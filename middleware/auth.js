const jwt = require('jsonwebtoken');

// JWT doğrulama middleware'i
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token gerekli' });

    jwt.verify(token, 'secretkey', (err, user) => {
        if (err) return res.status(403).json({ error: 'Geçersiz token' });
        req.user = user;
        next();
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
