const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: String,
    productCode: String,
    productName: String,
    stockQuantity: Number,
    VAT: Number,
    brand: String,
    barcode: String,
    wholesalePrice: Number,
    mainUnit: String,
    productType: Number,
    activeStatus: Number
    // Diğer alanlar eklenecek
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
