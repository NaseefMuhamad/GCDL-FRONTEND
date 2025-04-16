import { useForm } from 'react-hook-form';
import { useApi } from '../hooks/useApi';
import FormError from '../components/FormError';
import LiveClock from '../components/LiveClock';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { createObjectCsvStringifier } from 'csv-writer';
import ExcelJS from 'exceljs';
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
      const payload = {
        produceName: String(data.produceName),
        tonnage: parseFloat(data.tonnage),
        amountPaid: parseFloat(data.amountPaid),
        buyerName: String(data.buyerName),
        salesAgentName: String(data.salesAgentName),
        date: String(data.date),
        time: String(data.time),
        buyerContact: String(data.buyerContact),
      };
      const response = await execute(payload, 'POST');

      // Update stock
      await execute({
        produceName: payload.produceName,
        tonnage: -payload.tonnage,
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
        { text: Sale ID: ${saleData.id}, margin: [0, 20, 0, 10] },
        { text: Produce: ${saleData.produceName}, margin: [0, 0, 0, 10] },
        { text: Tonnage: ${saleData.tonnage} tons, margin: [0, 0, 0, 10] },
        { text: Amount Paid: $${saleData.amountPaid}, margin: [0, 0, 0, 10] },
        { text: Buyer: ${saleData.buyerName}, margin: [0, 0, 0, 10] },
        { text: Agent: ${saleData.salesAgentName}, margin: [0, 0, 0, 10] },
        { text: Contact: ${saleData.buyerContact}, margin: [0, 0, 0, 10] },
        { text: Date: ${saleData.date} ${saleData.time}, margin: [0, 0, 0, 10] },
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 20],
        },
      },
    };
    pdfMake.createPdf(documentDefinition).download(receipt_${saleData.id}.pdf);
  };

  const exportToPDF = () => {
    const documentDefinition = {
      content: [
        { text: 'Sales Records', style: 'header' },
        {
          ul: data.map((item, index) => ({
            text: ${index + 1}. ${item.produceName} | ${item.tonnage} tons | $${item.amountPaid} | ${item.buyerName} | ${item.date},
            margin: [0, 5, 0, 5],
          })),
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

  const exportToCSV = async () => {
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'Produce', title: 'Produce' },
        { id: 'Tonnage', title: 'Tonnage' },
        { id: 'AmountPaid', title: 'AmountPaid' },
        { id: 'Buyer', title: 'Buyer' },
        { id: 'Agent', title: 'Agent' },
        { id: 'Contact', title: 'Contact' },
        { id: 'Date', title: 'Date' },
      ],
    });
    const records = data.map(item => ({
      Produce: item.produceName,
      Tonnage: item.tonnage,
      AmountPaid: item.amountPaid,
      Buyer: item.buyerName,
      Agent: item.salesAgentName,
      Contact: item.buyerContact,
      Date: item.date,
    }));
    const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
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
    data.forEach(item => {
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
        <div className="form-group">
          <label>Produce Name</label>
          <select
            {...register('produceName', { required: 'Produce name is required' })}
            className="form-input"
          >
            <option value="">Select Produce</option>
            <option value="beans">Beans</option>
            <option value="grain_maize">Grain Maize</option>
            <option value="cowpeas">Cowpeas</option>
            <option value="groundnuts">Groundnuts</option>
            <option value="rice">Rice</option>
            <option value="soybeans">Soybeans</option>
          </select>
          {errors.produceName && <FormError message={errors.produceName.message} />}
        </div>
        <div className="form-group">
          <label>Tonnage (tons)</label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            {...register('tonnage', {
              required: 'Tonnage is required',
              min: { value: 0.1, message: 'Minimum 0.1 ton' },
              valueAsNumber: true,
            })}
            className="form-input"
          />
          {errors.tonnage && <FormError message={errors.tonnage.message} />}
        </div>
        <div className="form-group">
          <label>Amount Paid (USD)</label>
          <input
            type="number"
            step="0.01"
            {...register('amountPaid', {
              required: 'Amount paid is required',
              min: { value: 0, message: 'Amount cannot be negative' },
              valueAsNumber: true,
            })}
            className="form-input"
          />
          {errors.amountPaid && <FormError message={errors.amountPaid.message} />}
        </div>
        <div className="form-group">
          <label>Buyer’s Name</label>
          <input
            type="text"
            {...register('buyerName', { required: 'Buyer’s name is required' })}
            className="form-input"
          />
          {errors.buyerName && <FormError message={errors.buyerName.message} />}
        </div>
        <div className="form-group">
          <label>Sales Agent’s Name</label>
          <input
            type="text"
            {...register('salesAgentName', {
              required: 'Sales agent’s name is required',
            })}
            className="form-input"
          />
          {errors.salesAgentName && <FormError message={errors.salesAgentName.message} />}
        </div>
        <div className="form-group">
          <label>Buyer’s Contact</label>
          <input
            type="tel"
            {...register('buyerContact', {
              required: 'Contact is required',
              pattern: {
                value: /^\+?\d{10,12}$/,
                message: 'Invalid phone number (e.g., +1234567890 or 0734128903)',
              },
            })}
            className="form-input"
            placeholder="0734128903"
          />
          {errors.buyerContact && <FormError message={errors.buyerContact.message} />}
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            {...register('date', { required: 'Date is required' })}
            className="form-input"
          />
          {errors.date && <FormError message={errors.date.message} />}
        </div>
        <div className="form-group">
          <label>Time</label>
          <input
            type="time"
            {...register('time', { required: 'Time is required' })}
            className="form-input"
          />
          {errors.time && <FormError message={errors.time.message} />}
        </div>
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
        {data && data.length > 0 ? (
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
              {data.map((item) => (
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