const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Giriş yapma ve token oluşturma
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Kullanıcıyı email ile bul
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'E-posta veya şifre yanlış' });
        }

        // Şifreyi doğrula
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'E-posta veya şifre yanlış' });
        }

        // JWT oluştur
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            'secretkey', // Bu anahtar projeye özeldir, çevre değişkeni olarak ayarlanabilir
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Giriş başarılı', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { login };
