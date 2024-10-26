const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Kullanıcı ekleme
async function addUser(req, res) {
    try {
        const { firstName, lastName, username, email, password, role, phone, address, location } = req.body;

        // Aynı e-posta veya kullanıcı adına sahip bir kullanıcı var mı kontrol et
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Bu e-posta veya kullanıcı adı zaten kullanımda.' });
        }

        // Şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // Yeni kullanıcı oluştur
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            role,
            phone,
            address,
            location
        });

        await newUser.save();
        res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu', user: newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Kullanıcıları listeleme
async function listUsers(req, res) {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Kullanıcı güncelleme
async function updateUser(req, res) {
    try {
        const userId = req.params.id;
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        res.status(200).json({ message: 'Kullanıcı başarıyla güncellendi', user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Kullanıcı silme
async function deleteUser(req, res) {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'Kullanıcı başarıyla silindi' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { addUser, listUsers, updateUser, deleteUser };
