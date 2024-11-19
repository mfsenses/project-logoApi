/**
 * index.js
 * Uygulamanın ana dosyasıdır. MongoDB bağlantısını sağlar ve rotaları tanımlar.
 * Sunucuyu başlatır ve belirlenen port üzerinden çalıştırır.
 */

const express = require('express'); // Express.js modülünü içe aktar
const { connectMongoDB } = require('./db/dbConnection'); // MongoDB bağlantı fonksiyonunu içe aktar

// Rota dosyalarını içe aktar
const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customers');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/carts');
const orderRoutes = require('./routes/orders');

const app = express(); // Express uygulamasını başlat
const port = process.env.PORT || 3000; // Varsayılan port 3000

// Middleware
app.use(express.json()); // Gelen JSON gövdelerini ayrıştırır ve req.body'ye yerleştirir

// MongoDB Bağlantısı
connectMongoDB(); // MongoDB bağlantısını başlat

// Rota tanımları
app.use('/api/products', productRoutes); // Ürün rotaları
app.use('/api/customers', customerRoutes); // Müşteri rotaları
app.use('/api/users', userRoutes); // Kullanıcı rotaları
app.use('/api/auth', authRoutes); // Kimlik doğrulama rotaları
app.use('/api/carts', cartRoutes); // Sepet rotaları
app.use('/api/orders', orderRoutes); // Sipariş rotaları

// Test rotası
app.get('/test', (req, res) => {
    res.send('Sunucu çalışıyor!'); // Basit bir test yanıtı döner
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor...`);
});
