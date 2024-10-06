const express = require('express');
const { connectMongoDB } = require('./db/dbConnection');

// Rotaları içe aktar
const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customers');

const app = express();
const port = 3000;

// MongoDB'ye bağlan
connectMongoDB();

// Rota tanımlamaları
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);

// Test endpoint'i
app.get('/test', (req, res) => {
    res.send('Sunucu çalışıyor!');
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor...`);
});
