// MongoDB bağlantısını sağlayan modül
const mongoose = require('mongoose');

// MongoDB'ye bağlanmayı sağlayan asenkron fonksiyon
const connectToMongoDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/logoDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB bağlantısı başarılı!');
    } catch (error) {
        console.error('MongoDB bağlantı hatası:', error);
        process.exit(1); // Bağlantı başarısız olursa işlemi sonlandır
    }
};

module.exports = connectToMongoDB; // Fonksiyonu dışa aktar