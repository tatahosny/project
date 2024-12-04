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
        <td>${price.toFixed(2)} جنيه</td>
        <td>${quantity}</td>
        <td>${subtotal.toFixed(2)} جنيه</td>
    `;
    invoiceTableBody.appendChild(row);

    // تحديث إجمالي الفاتورة
    totalElement.textContent = total.toFixed(2);

    // مسح الحقول في النموذج
    invoiceForm.reset();
});

// تحميل الفاتورة بصيغة PDF عند الضغط على الزر
downloadButton.addEventListener('click', function() {
    const { jsPDF } = window.jspdf;

    // إنشاء مستند جديد من نوع PDF
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        lang: 'ar'
    });

    // إضافة النصوص العربية
    doc.setFont('Helvetica', 'normal');
    doc.text('فاتورة إلكترونية', 10, 10, { align: 'right' });

    // بناء محتوى الجدول
    let tableRows = [];
    document.querySelectorAll('#invoice-table tbody tr').forEach((row) => {
        const cols = row.querySelectorAll('td');
        tableRows.push([
            cols[0].innerText, // المنتج
            cols[1].innerText, // السعر
            cols[2].innerText, // الكمية
            cols[3].innerText, // الإجمالي
        ]);
    });

    // إضافة الجدول
    doc.autoTable({
        head: [['اسم المنتج', 'السعر (جنيه)', 'الكمية', 'الإجمالي (جنيه)']],
        body: tableRows,
        startY: 20,
        styles: { font: 'helvetica' },
    });

    // إضافة الإجمالي
    doc.text(`إجمالي الفاتورة: ${total.toFixed(2)} جنيه`, 10, doc.lastAutoTable.finalY + 10, {
        align: 'right',
    });

    // تحميل الفاتورة
    doc.save('invoice.pdf');
});
