const express = require('express');
const router = express.Router();
const { urunArama, syncProductsToMongoDB } = require('../controllers/productController');
const { syncTempProductsToProducts } = require('../controllers/syncController'); // Yeni senkronizasyon fonksiyonu

// Ürün arama
router.get('/urun-arama', async (req, res) => {
    const searchTerm = req.query.term || '';
    try {
        const data = await urunArama(searchTerm);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'MongoDB hatası: ' + err.message });
    }
});

// Ürünleri SQL'den MongoDB'ye senkronize etme
router.get('/sync-products', async (req, res) => {
    try {
        await syncProductsToMongoDB();
        res.json({ message: 'SQL’den MongoDB’ye ürün verileri başarıyla senkronize edildi.' });
    } catch (err) {
        res.status(500).json({ error: 'MongoDB hatası: ' + err.message });
    }
});

// Ürünleri MongoDB'nin tempproducts koleksiyonundan products koleksiyonuna senkronize etme
router.get('/sync-temp-to-products', async (req, res) => {
    try {
        await syncTempProductsToProducts();
        res.json({ message: 'Temp ürünler başarıyla products koleksiyonuna senkronize edildi.' });
    } catch (err) {
        res.status(500).json({ error: 'MongoDB hatası: ' + err.message });
    }
});

module.exports = router;
