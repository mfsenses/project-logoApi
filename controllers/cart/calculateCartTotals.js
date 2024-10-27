/**
 * calculateCartTotals.js
 * Sepetteki toplam tutar, ürün başına indirim ve KDV gibi değerleri hesaplamak için kullanılan yardımcı işlev.
 * Her bir ürün için indirimli fiyatı hesaplar, bu fiyat üzerinden KDV'yi uygular ve toplam değerleri günceller.
 */

function calculateCartTotals(cart) {
    let initialTotalAmount = 0; // İndirim öncesi toplam
    let discountTotal = 0; // Toplam iskonto (tekil ve genel iskontolar dahil)
    let VATAmount = 0; // Toplam KDV
    let totalAmountAfterDiscount = 0; // İskontolu toplam

    // Her bir ürün için hesaplamaları yap
    cart.items.forEach(item => {
        const itemTotal = item.quantity * item.price; // Ürün miktarı x fiyat
        const itemDiscount = itemTotal * (item.discount / 100); // Ürün başına iskonto
        const discountedTotal = itemTotal - itemDiscount; // İndirim sonrası toplam
        const itemVAT = discountedTotal * (item.VAT / 100); // İskontolu fiyata KDV

        initialTotalAmount += itemTotal; // İndirim öncesi toplam
        discountTotal += itemDiscount; // Ürün bazında toplam iskonto
        VATAmount += itemVAT; // Ürün bazında KDV toplamı
        totalAmountAfterDiscount += discountedTotal; // İndirim sonrası toplam
    });

    // Genel iskonto, ürün başına uygulanarak hesaplanır
    if (cart.generalDiscount) {
        const generalDiscountAmount = totalAmountAfterDiscount * (cart.generalDiscount / 100);

        // Ürün başına genel indirimi uygulayarak yeniden KDV hesapla
        VATAmount = 0; // KDV toplamını sıfırla ve yeniden hesapla
        totalAmountAfterDiscount -= generalDiscountAmount; // Genel iskonto sonrası toplam
        discountTotal += generalDiscountAmount; // Genel iskonto dahil toplam iskonto

        // Genel iskontolu tutara göre her bir ürün için KDV'yi yeniden hesapla
        cart.items.forEach(item => {
            const itemTotal = item.quantity * item.price;
            const itemDiscount = itemTotal * (item.discount / 100) + itemTotal * (cart.generalDiscount / 100);
            const discountedTotal = itemTotal - itemDiscount;
            const itemVAT = discountedTotal * (item.VAT / 100);

            VATAmount += itemVAT;
        });
    }

    // Nihai toplam, genel iskonto sonrası kalan tutara KDV eklenmiş tutardır
    const grandTotal = totalAmountAfterDiscount + VATAmount;

    // Sepet verilerini güncelle
    cart.totalAmount = initialTotalAmount; // İndirim öncesi toplam
    cart.discountTotal = discountTotal; // Toplam iskonto (tekil ve genel)
    cart.totalAmountAfterDiscount = totalAmountAfterDiscount; // İndirim sonrası toplam
    cart.VATAmount = VATAmount; // Toplam KDV
    cart.grandTotal = grandTotal; // Nihai toplam
}

module.exports = calculateCartTotals;
