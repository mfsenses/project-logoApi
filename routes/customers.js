const express = require('express');
const router = express.Router();
const { cariArama, syncCustomersToMongoDB } = require('../controllers/customerController');

// Cari arama
router.get('/cari-arama', async (req, res) => {
    const searchTerm = req.query.term || '';
    try {
        const data = await cariArama(searchTerm);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'MongoDB hatası: ' + err.message });
    }
});

// Carileri MongoDB'ye senkronize etme
router.get('/sync-customers', async (req, res) => {
    try {
        await syncCustomersToMongoDB();
        res.json({ message: 'Cari verileri başarıyla senkronize edildi.' });
    } catch (err) {
        res.status(500).json({ error: 'MongoDB hatası: ' + err.message });
    }
});

module.exports = router;
