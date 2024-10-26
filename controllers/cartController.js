/**
 * cartController.js
 * Bu dosya, sepete ürün ekleme, çıkarma, sepet görüntüleme, iskontolar ve
 * KDV hesaplamaları gibi sepet işlemlerini gerçekleştiren fonksiyonları içerir.
 */

const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Sepet oluşturma veya mevcut sepete ürün ekleme
async function addToCart(req, res) {
    try {
        const { productId, quantity, discount } = req.body;
        const userId = req.user.userId;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Ürün bulunamadı' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.productId.equals(productId));
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.discount = discount || existingItem.discount;
        } else {
            cart.items.push({
                productId,
                quantity,
                price: product.wholesalePrice,
                VAT: product.VAT,
                discount: discount || 0
            });
        }

        await calculateCartTotals(cart);
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Sepetten ürün çıkarma
async function removeFromCart(req, res) {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.userId;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Sepet bulunamadı' });
        }

        const existingItem = cart.items.find(item => item.productId.equals(productId));
        if (existingItem) {
            existingItem.quantity -= quantity;
            if (existingItem.quantity <= 0) {
                cart.items = cart.items.filter(item => !item.productId.equals(productId));
            }
        }

        await calculateCartTotals(cart);
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Sepeti tamamen boşaltma ve genel indirimi sıfırlama
async function clearCart(req, res) {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Sepet bulunamadı' });
        }

        cart.items = [];
        cart.totalAmount = 0;
        cart.discountTotal = 0;
        cart.totalAmountAfterDiscount = 0;
        cart.VATAmount = 0;
        cart.grandTotal = 0;
        cart.generalDiscount = 0;
        await cart.save();
        res.status(200).json({ message: 'Sepet ve genel indirim başarıyla sıfırlandı' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Sepeti görüntüleme
async function viewCart(req, res) {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ userId }).populate('items.productId', 'productCode productName barcode');

        if (!cart) {
            return res.status(404).json({ error: 'Sepet bulunamadı' });
        }

        // Toplamları doğru formatta hesapla
        await calculateCartTotals(cart);

        // İstenilen formatta çıktıyı düzenle
        const formattedCart = {
            totalAmount: `${(cart.totalAmount || 0).toFixed(2)} TL`,
            discountTotal: `${(cart.discountTotal || 0).toFixed(2)} TL`,
            totalAmountAfterDiscount: `${(cart.totalAmountAfterDiscount || 0).toFixed(2)} TL`,
            VATAmount: `${(cart.VATAmount || 0).toFixed(2)} TL`,
            grandTotal: `${(cart.grandTotal || 0).toFixed(2)} TL`,
            items: cart.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: `${item.price.toFixed(2)} TL`,
                discount: item.discount,
                VAT: item.VAT
            }))
        };

        res.status(200).json(formattedCart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


// Sepet genel iskonto ekleme veya güncelleme
async function setGeneralDiscount(req, res) {
    try {
        const { generalDiscount } = req.body;
        const userId = req.user.userId;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Sepet bulunamadı' });
        }

        cart.generalDiscount = generalDiscount;
        await calculateCartTotals(cart);
        await cart.save();
        res.status(200).json({ message: 'Genel iskonto başarıyla uygulandı', cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Sepetteki bir ürüne iskonto uygulama
async function applyDiscountToItem(req, res) {
    try {
        const { productId, discount } = req.body;
        const userId = req.user.userId;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: 'Sepet bulunamadı' });
        }

        const existingItem = cart.items.find(item => item.productId.equals(productId));
        if (existingItem) {
            existingItem.discount = discount;
        } else {
            return res.status(404).json({ error: 'Sepette bu ürün bulunamadı' });
        }

        await calculateCartTotals(cart);
        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Sepet toplamlarını güncellenmiş hesaplama ile
async function calculateCartTotals(cart) {
    let initialTotalAmount = 0; // İndirim öncesi toplam
    let discountTotal = 0; // Toplam iskonto
    let VATAmount = 0; // Toplam KDV
    let totalAmountAfterDiscount = 0; // İskontolu toplam

    cart.items.forEach(item => {
        const itemTotal = item.quantity * item.price; // Ürün miktarı x fiyat
        const itemDiscount = itemTotal * (item.discount / 100); // Ürün başına iskonto
        const discountedTotal = itemTotal - itemDiscount; // İndirim sonrası toplam
        const itemVAT = discountedTotal * (item.VAT / 100); // İskontolu fiyata KDV

        initialTotalAmount += itemTotal; // İndirim öncesi toplam
        discountTotal += itemDiscount; // Toplam iskonto
        VATAmount += itemVAT; // KDV toplamı
        totalAmountAfterDiscount += discountedTotal; // İndirim sonrası toplam
    });

    // Nihai toplam, indirim sonrası KDV eklenmiş tutar üzerinden genel iskonto uygulanarak hesaplanır
    const grandTotal = totalAmountAfterDiscount + VATAmount - (cart.generalDiscount || 0);

    // Sepet verilerini güncelle
    cart.totalAmount = initialTotalAmount; // İndirim öncesi toplam
    cart.discountTotal = discountTotal; // Toplam iskonto
    cart.totalAmountAfterDiscount = totalAmountAfterDiscount; // İndirim sonrası toplam
    cart.VATAmount = VATAmount; // Toplam KDV
    cart.grandTotal = grandTotal; // Nihai toplam
}


module.exports = { addToCart, removeFromCart, clearCart, viewCart, setGeneralDiscount, applyDiscountToItem };
