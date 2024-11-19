/**
 * controllers/syncCustomerController.js
 * Temp carileri aktif cariler koleksiyonuna senkronize eder.
 */

const connectToMongoDB = require('../db/connection'); // MongoDB bağlantısı
const TempCustomer = require('../models/tempCustomerModel'); // Temp müşteri modeli
const Customer = require('../models/customerModel'); // Aktif müşteri modeli

// Senkronizasyon fonksiyonu
const syncTempCustomersToCustomers = async () => {
    try {
        await connectToMongoDB(); // MongoDB bağlantısını başlat

        // Temp carilerden tüm verileri al
        const tempCustomers = await TempCustomer.find();

        for (const tempCustomer of tempCustomers) {
            // Mevcut cariyi kontrol et
            const existingCustomer = await Customer.findOne({ customerId: tempCustomer.customerId });

            if (existingCustomer) {
                // Mevcut cariyi güncelle
                await Customer.updateOne(
                    { customerId: tempCustomer.customerId },
                    { $set: tempCustomer.toObject() }
                );
                console.log(`Güncellendi: ${tempCustomer.customerId}`);
            } else {
                // Yeni cari ekle
                await Customer.create(tempCustomer.toObject());
                console.log(`Eklendi: ${tempCustomer.customerId}`);
            }
        }

        console.log('Müşteri senkronizasyonu tamamlandı.');
    } catch (error) {
        console.error('Müşteri senkronizasyonu sırasında hata:', error);
    }
};

module.exports = { syncTempCustomersToCustomers };
