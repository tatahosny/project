const invoiceForm = document.getElementById('invoice-form');
const invoiceTableBody = document.querySelector('#invoice-table tbody');
const totalElement = document.getElementById('total');
const downloadButton = document.getElementById('download-pdf');

let total = 0;

// إضافة منتج إلى الفاتورة
invoiceForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const item = document.getElementById('item').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    const subtotal = price * quantity;
    total += subtotal;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item}</td>
        <td>${price.toFixed(2)} جنيه</td>
        <td>${quantity}</td>
        <td>${subtotal.toFixed(2)} جنيه</td>
    `;
    invoiceTableBody.appendChild(row);

    totalElement.textContent = total.toFixed(2);

    invoiceForm.reset();
});

// تحميل الفاتورة كـ PDF
downloadButton.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text('فاتورة إلكترونية', 10, 10);
    doc.autoTable({
        head: [['اسم المنتج', 'السعر', 'الكمية', 'الإجمالي']],
        body: Array.from(invoiceTableBody.children).map(row => 
            Array.from(row.children).map(cell => cell.textContent)
        ),
    });

    doc.text(`إجمالي: ${total.toFixed(2)} جنيه`, 10, doc.lastAutoTable.finalY + 10);
    doc.save('invoice.pdf');
});
