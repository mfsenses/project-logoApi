const Product = require('../models/productModel');
const { connectSQL } = require('../db/dbConnection');
const sql = require('mssql');


// Ürün arama fonksiyonu
async function urunArama(searchTerm) {
    try {
        const regex = new RegExp(searchTerm, 'i'); // Case insensitive regex
        const products = await Product.find({
            $or: [
                { productName: regex },
                { brand: regex },
                { barcode: regex }
            ]
        });
        return products;
    } catch (err) {
        throw new Error('MongoDB hatası: ' + err);
    }
}




// Ürünleri MongoDB'ye senkronize etme
async function syncProductsToMongoDB() {
    try {
        let pool = await connectSQL();
        let result = await pool.request()
            .execute('dbo.Tiotso_UrunArama');

        // SQL'den dönen veriyi logla
        console.log('SQL Sonuç:', result.recordset);

        for (let product of result.recordset) {
            // Ürünü bul veya yeni kayıt oluştur
            const existingProduct = await Product.findOne({ productId: product.productId });

            if (existingProduct) {
                // Güncelleme yap
                await Product.updateOne(
                    { productId: product.productId },
                    { $set: product }
                );
                console.log(`Güncellenen Ürün: ${product.productId}`);
            } else {
                // Yeni kayıt ekle
                await Product.create(product);
                console.log(`Eklenen Yeni Ürün: ${product.productId}`);
            }
        }

        console.log('Ürün verileri MongoDB’ye senkronize edildi.');
    } catch (err) {
        console.error('Veritabanı hatası:', err);
    }
}



module.exports = { urunArama, syncProductsToMongoDB };
