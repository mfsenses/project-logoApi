const express = require('express');
const router = express.Router();
const { urunArama, syncProductsToMongoDB } = require('../controllers/productController');

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

// Ürünleri MongoDB'ye senkronize etme
router.get('/sync-products', async (req, res) => {
    try {
        await syncProductsToMongoDB();
        res.json({ message: 'Ürün verileri başarıyla senkronize edildi.' });
    } catch (err) {
        res.status(500).json({ error: 'MongoDB hatası: ' + err.message });
    }
});

module.exports = router;
