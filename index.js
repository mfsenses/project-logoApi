/**
 * index.js
 * Uygulamanın ana dosyasıdır. MongoDB bağlantısını sağlar ve rotaları tanımlar.
 * Sunucuyu başlatır ve belirlenen port üzerinden çalıştırır.
 */

const express = require('express');
const { connectMongoDB } = require('./db/dbConnection');

const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customers');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/carts');
const orderRoutes = require('./routes/orders');

const app = express();
const port = 3000;

app.use(express.json());

connectMongoDB();

app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/test', (req, res) => {
    res.send('Sunucu çalışıyor!');
});

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor...`);
});
