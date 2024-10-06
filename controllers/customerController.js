const Customer = require('../models/customerModel');
const { connectSQL } = require('../db/dbConnection');
const sql = require('mssql');

// Cari arama fonksiyonu
async function cariArama(searchTerm) {
    try {
        const regex = new RegExp(searchTerm, 'i'); // Case insensitive regex
        const customers = await Customer.find({
            $or: [
                { customerName: regex },
                { customerCode: regex },
                { city: regex },
                { address: regex }
            ]
        });
        return customers;
    } catch (err) {
        console.error('MongoDB hatası:', err.message);
        throw new Error('MongoDB hatası: ' + err.message);
    }
}

// Carileri MongoDB'ye senkronize etme
async function syncCustomersToMongoDB() {
    try {
        let pool = await connectSQL();
        let result = await pool.request()
            .execute('dbo.Tiotso_CariArama');

        // SQL'den dönen veriyi logla
        console.log('SQL Sonuç:', result.recordset);

        for (let customer of result.recordset) {
            // Müşteriyi bul veya yeni kayıt oluştur
            const existingCustomer = await Customer.findOne({ customerId: customer.CariID });

            if (existingCustomer) {
                // Güncelleme yap
                await Customer.updateOne(
                    { customerId: customer.CariID },
                    { $set: customer }
                );
                console.log(`Güncellenen Müşteri: ${customer.CariID}`);
            } else {
                // Yeni kayıt ekle
                await Customer.create(customer);
                console.log(`Eklenen Yeni Müşteri: ${customer.CariID}`);
            }
        }

        console.log('Cari verileri MongoDB’ye senkronize edildi.');
    } catch (err) {
        console.error('Veritabanı hatası:', err.message);
    }
}


module.exports = { cariArama, syncCustomersToMongoDB };
