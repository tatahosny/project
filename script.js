const invoiceForm = document.getElementById('invoice-form');
const invoiceTableBody = document.querySelector('#invoice-table tbody');
const totalElement = document.getElementById('total');
const downloadButton = document.getElementById('download-pdf');

let total = 0;

// إضافة المنتج إلى الجدول
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

    doc.text('فاتورة إلكترونية', 105, 10, { align: 'center' });

    const tableRows = [];
    document.querySelectorAll('#invoice-table tbody tr').forEach((row) => {
        const cols = row.querySelectorAll('td');
        const rowData = Array.from(cols).map(col => col.textContent);
        tableRows.push(rowData);
    });

    doc.autoTable({
        head: [['اسم المنتج', 'السعر (جنيه)', 'الكمية', 'الإجمالي']],
        body: tableRows,
        startY: 20,
    });

    doc.text(`الإجمالي: ${total.toFixed(2)} جنيه`, 105, doc.lastAutoTable.finalY + 10, { align: 'right' });

    doc.save('invoice.pdf');
});
