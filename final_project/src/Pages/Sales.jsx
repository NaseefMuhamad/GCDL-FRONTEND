import { useForm } from 'react-hook-form';
import { useApi } from '../hooks/useApi';
import FormError from "../components/FormError";

import LiveClock from "../components/LiveClock";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { saveAs } from 'file-saver';

// Register fonts for pdfmake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function Sales() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { data, loading, error, execute } = useApi('sales');

  const onSubmit = async (data) => {
    try {
      console.log('Form data:', data);
      const salesPayload = {
        produceName: String(data.produceName),
        tonnage: parseFloat(data.tonnage),
        amountPaid: parseFloat(data.amountPaid),
        buyerName: String(data.buyerName),
        salesAgentName: String(data.salesAgentName),
        date: String(data.date),
        time: String(data.time),
        buyerContact: String(data.buyerContact),
      };
      const response = await execute(salesPayload, 'POST', 'sales');

      // Update stock
      await execute({
        produceName: salesPayload.produceName,
        tonnage: -salesPayload.tonnage,
      }, 'POST', 'stock/update');

      // Generate receipt
      generateReceipt(response.data);

      reset();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const generateReceipt = (saleData) => {
    const documentDefinition = {
      content: [
        { text: 'Golden Crop Sales Receipt', style: 'header' },
        { text: `Sale ID: ${saleData.id}`, margin: [0, 20, 0, 10] },
        { text: `Produce: ${saleData.produceName}`, margin: [0, 0, 0, 10] },
        { text: `Tonnage: ${saleData.tonnage} tons`, margin: [0, 0, 0, 10] },
        { text: `Amount Paid: $${saleData.amountPaid}`, margin: [0, 0, 0, 10] },
        { text: `Buyer: ${saleData.buyerName}`, margin: [0, 0, 0, 10] },
        { text: `Agent: ${saleData.salesAgentName}`, margin: [0, 0, 0, 10] },
        { text: `Contact: ${saleData.buyerContact}`, margin: [0, 0, 0, 10] },
        { text: `Date: ${saleData.date} ${saleData.time}`, margin: [0, 0, 0, 10] },
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 20],
        },
      },
    };
    pdfMake.createPdf(documentDefinition).download(`receipt_${saleData.id}.pdf`);
  };

  const exportToPDF = () => {
    const documentDefinition = {
      content: [
        { text: 'Sales Records', style: 'header' },
        {
          ul: data?.data?.map((item, index) => ({
            text: `${index + 1}. ${item.produceName} | ${item.tonnage} tons | $${item.amountPaid} | ${item.buyerName} | ${item.date}`,
            margin: [0, 5, 0, 5],
          })) || [],
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 20],
        },
      },
    };
    pdfMake.createPdf(documentDefinition).download('sales_records.pdf');
  };

  // Replace the current exportToCSV function with the custom code here
  const exportToCSV = () => {
    const records = data?.data?.map(item => ({
      Produce: item.produceName,
      Tonnage: item.tonnage,
      AmountPaid: item.amountPaid,
      Buyer: item.buyerName,
      Agent: item.salesAgentName,
      Contact: item.buyerContact,
      Date: item.date,
    })) || [];

    // Define CSV headers
    const headers = ['Produce', 'Tonnage', 'AmountPaid', 'Buyer', 'Agent', 'Contact', 'Date'];

    // Create CSV content
    const csvContent = [
      headers.join(','),  // Add headers as first line
      ...records.map(record => [
        record.Produce,
        record.Tonnage,
        record.AmountPaid,
        record.Buyer,
        record.Agent,
        record.Contact,
        record.Date,
      ].join(',')),  // Join each record's values
    ].join('\n');  // Join rows with newline

    // Create Blob and save as CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'sales_records.csv');
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales');
    worksheet.columns = [
      { header: 'Produce', key: 'Produce', width: 20 },
      { header: 'Tonnage', key: 'Tonnage', width: 15 },
      { header: 'Amount Paid', key: 'AmountPaid', width: 15 },
      { header: 'Buyer', key: 'Buyer', width: 20 },
      { header: 'Agent', key: 'Agent', width: 20 },
      { header: 'Contact', key: 'Contact', width: 20 },
      { header: 'Date', key: 'Date', width: 15 },
    ];
    data?.data?.forEach(item => {
      worksheet.addRow({
        Produce: item.produceName,
        Tonnage: item.tonnage,
        AmountPaid: item.amountPaid,
        Buyer: item.buyerName,
        Agent: item.salesAgentName,
        Contact: item.buyerContact,
        Date: item.date,
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'sales_records.xlsx');
  };

  return (
    <section className="sales-container">
      <h2 className="sales-title">Sales Management</h2>
      <div className="live-clock-container">
        <LiveClock />
      </div>
      <div className="page-image-container">
        <img
          src="/images/sales-transaction.jpg"
          alt="Sales Transaction"
          className="page-image"
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        {/* Form fields */}
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <div className="table-container">
        <h3>Sales Records</h3>
        <div className="export-buttons">
          <button onClick={exportToPDF} className="export-button">Export PDF</button>
          <button onClick={exportToCSV} className="export-button">Export CSV</button>
          <button onClick={exportToExcel} className="export-button">Export Excel</button>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="form-error">{error}</p>}
        {data?.data?.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Produce</th>
                <th>Tonnage</th>
                <th>Amount Paid</th>
                <th>Buyer</th>
                <th>Agent</th>
                <th>Contact</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((item) => (
                <tr key={item.id}>
                  <td>{item.produceName}</td>
                  <td>{item.tonnage}</td>
                  <td>${item.amountPaid}</td>
                  <td>{item.buyerName}</td>
                  <td>{item.salesAgentName}</td>
                  <td>{item.buyerContact}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No records found.</p>
        )}
      </div>
    </section>
  );
}

export default Sales;
