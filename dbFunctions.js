const sql = require('mssql');

// Veritabanı bağlantı ayarları
const config = {
    user: 'sa',  // SQL Server kullanıcı adınız
    password: 'Logo1234',    // SQL Server şifreniz
    server: '192.168.2.105', // Sunucunuzun IP adresi
    database: 'LOGO',        // Erişmek istediğiniz veritabanı adı
    options: {
        encrypt: false,      // Şifreleme (SSL kullanıyorsanız true yapın)
        enableArithAbort: true
    },
    port: 1433               // SQL Server portu (varsayılan 1433)
};

// Ürün arama fonksiyonu
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

// Cari arama fonksiyonu
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

// Fonksiyonları dışa aktar
module.exports = {
    urunArama,
    cariArama
};
