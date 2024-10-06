const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerId: String,
    customerName: String,
    customerCode: String,
    address: String,
    address2: String,
    district: String,
    city: String,
    country: String,
    phone: String,
    email: String,
    cityGroup: String,
    category: String,
    authorizedPerson: String,
    taxNumber: String,
    nationalID: String,
    firstName: String,
    lastName: String,
    taxOffice: String,
    logoID: String,
    createdBy: String
    // Diğer alanlar eklenecek
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
