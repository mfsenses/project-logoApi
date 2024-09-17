const express = require('express');
const dbFunctions = require('./dbFunctions'); // Veritabanı işlemleri fonksiyonlarını içe aktarıyoruz

const app = express();
const port = 3000;

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

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor...`);
});
