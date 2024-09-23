const sql = require('mssql');
const mongoose = require('mongoose');

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/logoDB', { useNewUrlParser: true, useUnifiedTopology: true });

// MongoDB veri şeması ve modelleri
const productSchema = new mongoose.Schema({
    productId: String,
    productName: String,
    stock: Number,
    // Diğer alanları ekleyin
});
const customerSchema = new mongoose.Schema({
    customerId: String,
    customerName: String,
    // Diğer alanları ekleyin
});

const Product = mongoose.model('Product', productSchema);
const Customer = mongoose.model('Customer', customerSchema);

// SQL Server bağlantı ayarları
const config = {
    user: 'sa',  // SQL Server kullanıcı adınız
    password: 'Logo1234',    // SQL Server şifreniz
    server: '78.187.237.138', // Sunucunuzun IP adresi
    database: 'LOGO',        // Erişmek istediğiniz veritabanı adı
    options: {
        encrypt: false,      // Şifreleme (SSL kullanıyorsanız true yapın)
        enableArithAbort: true
    },
    port: 1433               // SQL Server portu (varsayılan 1433)
};

// Ürün arama fonksiyonu (SQL Server'dan)
async function urunArama(searchTerm) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('searchTerm', sql.NVarChar(100), searchTerm)
            .execute('dbo.Tiotso_Urunarama'); // Stored Procedure adınızı buraya girin

        sql.close();
        return result.recordset;
    } catch (err) {
        sql.close();
        throw new Error('Veritabanı hatası: ' + err);
    }
}

// Cari arama fonksiyonu (SQL Server'dan)
async function cariArama(searchTerm) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('searchTerm', sql.NVarChar(100), searchTerm)
            .execute('dbo.Tiotso_CariArama'); // Stored Procedure adınızı buraya girin

        sql.close();
        return result.recordset;
    } catch (err) {
        sql.close();
        throw new Error('Veritabanı hatası: ' + err);
    }
}

// MongoDB'ye Ürün verilerini senkronize etme fonksiyonu
async function syncProductsToMongoDB() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM dbo.Tiotso_Urunarama'); // Ürünleri SQL Server'dan çekin
        
        // Mevcut tüm ürünleri MongoDB'de güncelleyin veya ekleyin
        for (let product of result.recordset) {
            await Product.updateOne(
                { productId: product.productId },
                { $set: product },
                { upsert: true }
            );
        }

        sql.close();
        console.log('Ürün verileri MongoDB’ye senkronize edildi.');
    } catch (err) {
        sql.close();
        console.error('Veritabanı hatası: ' + err);
    }
}

// MongoDB'ye Cari verilerini senkronize etme fonksiyonu
async function syncCustomersToMongoDB() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM dbo.Tiotso_CariArama'); // Carileri SQL Server'dan çekin
        
        // Mevcut tüm carileri MongoDB'de güncelleyin veya ekleyin
        for (let customer of result.recordset) {
            await Customer.updateOne(
                { customerId: customer.customerId },
                { $set: customer },
                { upsert: true }
            );
        }

        sql.close();
        console.log('Cari verileri MongoDB’ye senkronize edildi.');
    } catch (err) {
        sql.close();
        console.error('Veritabanı hatası: ' + err);
    }
}

// Fonksiyonları dışa aktar
module.exports = {
    urunArama,
    cariArama,
    syncProductsToMongoDB,
    syncCustomersToMongoDB
};
