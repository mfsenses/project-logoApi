/**
 * routes/customers.js
 * Müşterilere ait rotaları tanımlar.
 * Temp carilerden aktif carilere senkronizasyon, cari arama ve SQL'den MongoDB'ye senkronizasyon işlemlerini içerir.
 */

const express = require('express');
const router = express.Router();
const { cariArama, syncCustomersToMongoDB } = require('../controllers/customerController');
const { syncTempCustomersToCustomers } = require('../controllers/syncCustomerController');

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

// Carileri SQL'den MongoDB'ye senkronize etme
router.get('/sync-customers', async (req, res) => {
    try {
        await syncCustomersToMongoDB();
        res.json({ message: 'Cari verileri başarıyla SQL’den MongoDB’ye senkronize edildi.' });
    } catch (err) {
        res.status(500).json({ error: 'MongoDB hatası: ' + err.message });
    }
});

// Temp carileri aktif carilere senkronize et
router.get('/sync-temp-to-customers', async (req, res) => {
    try {
        await syncTempCustomersToCustomers(); // Senkronizasyon fonksiyonunu çağır
        res.json({ message: 'Temp cariler başarıyla aktif carilere senkronize edildi.' });
    } catch (err) {
        res.status(500).json({ error: 'MongoDB hatası: ' + err.message });
    }
});

module.exports = router;
