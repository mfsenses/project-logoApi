// Products koleksiyonunu temsil eden Mongoose modeli
const mongoose = require('mongoose');

// Aktif ürünlerin veritabanı şeması
const productSchema = new mongoose.Schema({
    productId: Number,
    productCode: String,
    productName: String,
    hierarchyCode: Number,
    categoryCode: String,
    categoryName: String,
    VAT: Number,
    brand: String,
    groupCode: String,
    barcode: String,
    wholesalePrice: Number,
    priceType: String,
    priceTypeCode: String,
    priceGroupCode: String,
    stockQuantity: Number,
    mainUnit: String,
    accessFlags: Number,
    accessStatus: String,
    eBusinessAccessible: Boolean,
    eStoreAccessible: Boolean,
    posAccessible: Boolean,
}, { collection: 'products' });

module.exports = mongoose.model('Product', productSchema); // Modeli dışa aktar