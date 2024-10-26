const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'personel', 'depo', 'pazarlama', 'musteri'], required: true },
    phone: { type: String, required: true },
    address: {
        street: String,
        city: String,
        postalCode: String,
        country: String
    },
    location: { type: String }, // Örn: İstanbul, Türkiye
    createdDate: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    status: { type: String, enum: ['aktif', 'pasif'], default: 'aktif' }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
