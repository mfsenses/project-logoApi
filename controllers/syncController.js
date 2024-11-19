/**
 * controllers/syncController.js
 * Temp koleksiyonundaki verileri products koleksiyonuna senkronize eder.
 */

const connectToMongoDB = require('../db/connection'); // MongoDB bağlantısı
const TempProduct = require('../models/tempProductModel'); // Temp ürün modeli
const Product = require('../models/productModel'); // Aktif ürün modeli

// Senkronizasyon fonksiyonu
const syncTempProductsToProducts = async () => {
    try {
        await connectToMongoDB(); // MongoDB bağlantısını başlat

        // Temp koleksiyonundaki tüm verileri al
        const tempProducts = await TempProduct.find();

        for (const tempProduct of tempProducts) {
            // Mevcut ürünleri kontrol et
            const existingProduct = await Product.findOne({ productId: tempProduct.productId });

            if (existingProduct) {
                // Mevcut ürünü güncelle
                await Product.updateOne(
                    { productId: tempProduct.productId },
                    { $set: tempProduct.toObject() }
                );
                console.log(`Güncellendi: ${tempProduct.productId}`);
            } else {
                // Yeni ürün ekle
                await Product.create(tempProduct.toObject());
                console.log(`Eklendi: ${tempProduct.productId}`);
            }
        }

        console.log('Senkronizasyon tamamlandı.');
    } catch (error) {
        console.error('Senkronizasyon sırasında hata:', error);
    }
};

module.exports = { syncTempProductsToProducts }; // Fonksiyonu dışa aktar, otomatik çağırma kaldırıldı
