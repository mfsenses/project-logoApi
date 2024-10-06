const mongoose = require('mongoose');
const sql = require('mssql');

// SQL Server bağlantı ayarları
const config = {
    user: 'sa', // SQL Server kullanıcı adı
    password: 'Logo1234', // SQL Server şifre
    //server: '78.187.237.138', // Sunucu IP adresi
    server: '192.168.2.105', // Lokal SQL Server IP adresi
    database: 'LOGO', // Veritabanı adı
    options: {
        encrypt: false,
        enableArithAbort: true
    },
    port: 1433, // SQL Server portu (varsayılan 1433)
    connectionTimeout: 30000, // Bağlantı zaman aşımı (ms cinsinden)
    requestTimeout: 30000 // İstek zaman aşımı (ms cinsinden)
};

// MongoDB bağlantısı
function connectMongoDB() {
    mongoose.connect('mongodb://localhost:27017/logoDB', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB’ye başarıyla bağlanıldı.'))
        .catch((err) => console.error('MongoDB bağlantı hatası:', err));
}

// SQL Server bağlantısı
async function connectSQL() {
    try {
        let pool = await sql.connect(config);
        console.log('SQL Server’a başarıyla bağlanıldı.');
        return pool;
    } catch (err) {
        console.error('SQL Server bağlantı hatası:', err);
        throw err; // Hata durumunda, hatayı üst seviyeye gönder
    }
}

module.exports = { connectMongoDB, connectSQL };
