const express = require('express');
const { connectMongoDB } = require('./db/dbConnection');

// Rotaları içe aktar
const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customers');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/carts'); // Yeni eklenen rota

const app = express();
const port = 3000;

app.use(express.json());

// MongoDB'ye bağlan
connectMongoDB();

// Rota tanımlamaları
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/carts', cartRoutes); // Yeni eklenen rota

// Test endpoint'i
app.get('/test', (req, res) => {
    res.send('Sunucu çalışıyor!');
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor...`);
});
