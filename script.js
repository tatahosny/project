const invoiceForm = document.getElementById('invoice-form');
const invoiceTableBody = document.querySelector('#invoice-table tbody');
const totalElement = document.getElementById('total');
const downloadButton = document.getElementById('download-pdf');

let total = 0;

// إضافة منتج إلى الفاتورة عند إرسال النموذج
invoiceForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // الحصول على القيم من الحقول
    const item = document.getElementById('item').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    // حساب المجموع الفرعي
    const subtotal = price * quantity;
    total += subtotal;

    // إضافة صف جديد إلى الجدول
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item}</td>
        <td>${price} ريال</td>
        <td>${quantity}</td>
        <td>${subtotal} ريال</td>
    `;
    invoiceTableBody.appendChild(row);

    // تحديث إجمالي الفاتورة
    totalElement.textContent = total.toFixed(2);

    // مسح الحقول في النموذج
    invoiceForm.reset();
});

// تحميل الفاتورة بصيغة PDF عند الضغط على الزر
downloadButton.addEventListener('click', function() {
    // التأكد من تحميل jsPDF بشكل صحيح
    const { jsPDF } = window.jspdf;

    // إنشاء مستند جديد من نوع PDF
    const doc = new jsPDF();

    // إضافة عنوان الفاتورة
    doc.text('فاتورة إلكترونية', 10, 10);

    // إضافة جدول الفاتورة إلى PDF باستخدام autoTable
    doc.autoTable({
        html: '#invoice-table',  // استخدام الجدول الموجود في HTML
        startY: 20,  // تحديد بداية الجدول أسفل العنوان
    });

    // إضافة إجمالي الفاتورة في أسفل الجدول
    doc.text(`إجمالي الفاتورة: ${total.toFixed(2)} ريال`, 10, doc.lastAutoTable.finalY + 10);

    // تحميل الفاتورة كملف PDF
    doc.save('invoice.pdf');
});
