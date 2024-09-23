const express = require('express');
const dbFunctions = require('./dbFunctions'); // Veritabanı işlemleri fonksiyonlarını içe aktarıyoruz

const app = express();
const port = 3000;

// Test endpoint'i
app.get('/test', (req, res) => {
    res.send('Sunucu çalışıyor!');
});

// Ürün arama endpoint'i
app.get('/urun-arama', async (req, res) => {
    const searchTerm = req.query.term ? `%${req.query.term}%` : '';
    try {
        const data = await dbFunctions.urunArama(searchTerm);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cari arama endpoint'i
app.get('/cari-arama', async (req, res) => {
    const searchTerm = req.query.term ? `%${req.query.term}%` : '';
    try {
        const data = await dbFunctions.cariArama(searchTerm);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ürünleri MongoDB'ye senkronize etme endpoint'i
app.get('/sync-products', async (req, res) => {
    try {
        await dbFunctions.syncProductsToMongoDB();
        res.json({ message: 'Ürün verileri başarıyla senkronize edildi.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Carileri MongoDB'ye senkronize etme endpoint'i
app.get('/sync-customers', async (req, res) => {
    try {
        await dbFunctions.syncCustomersToMongoDB();
        res.json({ message: 'Cari verileri başarıyla senkronize edildi.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor...`);
});
