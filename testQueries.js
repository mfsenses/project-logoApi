const { connectMongoDB } = require('./db/dbConnection');
const Customer = require('./models/customerModel');
const Product = require('./models/productModel');

// MongoDB'ye bağlan
connectMongoDB();

// Yeni eklenen müşterileri ve ürünleri sorgula
async function testQueries() {
    try {
        // Tüm müşteri verilerini getir
        const customers = await Customer.find({});
        console.log('Müşteri Verileri:', customers);

        // Tüm ürün verilerini getir
        const products = await Product.find({});
        console.log('Ürün Verileri:', products);

    } catch (err) {
        console.error('Hata:', err.message);
    }
}

// Sorgu fonksiyonunu çalıştır
testQueries();
