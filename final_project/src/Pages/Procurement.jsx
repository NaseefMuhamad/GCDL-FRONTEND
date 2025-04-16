import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import FormError from '../components/FormError';
import LiveClock from '../components/LiveClock';
import { toast } from 'react-toastify';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { createObjectCsvStringifier } from 'csv-writer';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Register fonts for pdfmake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function Procurement() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, loading, error, execute } = useApi(procurements?page=${page}&limit=${limit});

  const onSubmit = async (data) => {
    try {
      await execute(data, 'POST');
      reset();
      toast.success('Procurement recorded successfully!');
    } catch (error) {
      toast.error('Failed to record procurement.');
    }
  };

  const exportToPDF = () => {
    const documentDefinition = {
      content: [
        { text: 'Procurement Records', style: 'header' },
        {
          ul: data.data.map((item, index) => ({
            text: ${index + 1}. ${item.name} | ${item.type} | ${item.tonnage} tons | $${item.cost} | ${item.dealerName} | ${item.branch} | ${item.date},
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
    pdfMake.createPdf(documentDefinition).download('procurement_records.pdf');
  };

  const exportToCSV = async () => {
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'Produce', title: 'Produce' },
        { id: 'Type', title: 'Type' },
        { id: 'Tonnage', title: 'Tonnage' },
        { id: 'Cost', title: 'Cost' },
        { id: 'Dealer', title: 'Dealer' },
        { id: 'Branch', title: 'Branch' },
        { id: 'Contact', title: 'Contact' },
        { id: 'SellingPrice', title: 'Selling Price' },
        { id: 'Date', title: 'Date' },
      ],
    });
    const records = data.data.map(item => ({
      Produce: item.name,
      Type: item.type,
      Tonnage: item.tonnage,
      Cost: item.cost,
      Dealer: item.dealerName,
      Branch: item.branch,
      Contact: item.contact,
      SellingPrice: item.sellingPrice,
      Date: item.date,
    }));
    const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'procurement_records.csv');
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Procurement');
    worksheet.columns = [
      { header: 'Produce', key: 'Produce', width: 20 },
      { header: 'Type', key: 'Type', width: 15 },
      { header: 'Tonnage', key: 'Tonnage', width: 15 },
      { header: 'Cost', key: 'Cost', width: 15 },
      { header: 'Dealer', key: 'Dealer', width: 20 },
      { header: 'Branch', key: 'Branch', width: 15 },
      { header: 'Contact', key: 'Contact', width: 20 },
      { header: 'Selling Price', key: 'SellingPrice', width: 15 },
      { header: 'Date', key: 'Date', width: 15 },
    ];
    data.data.forEach(item => {
      worksheet.addRow({
        Produce: item.name,
        Type: item.type,
        Tonnage: item.tonnage,
        Cost: item.cost,
        Dealer: item.dealerName,
        Branch: item.branch,
        Contact: item.contact,
        SellingPrice: item.sellingPrice,
        Date: item.date,
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'procurement_records.xlsx');
  };

  return (
    <section className="procurement-container">
      <h2 className="procurement-title">Procurement Management</h2>
      <div className="live-clock-container">
        <LiveClock />
      </div>
      <div className="page-image-container">
        <img
          src="/images/procurement-truck.jpg"
          alt="Procurement Truck"
          className="page-image"
        />
      </div>
      {error && <p className="form-error">{error}</p>}
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
          <label>Type</label>
          <input
            type="text"
            {...register('type', { required: 'Type is required' })}
            className="form-input"
            placeholder="e.g., Red Beans"
          />
          {errors.type && <FormError message={errors.type.message} />}
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
        <div className="form-group">
          <label>Tonnage (tons)</label>
          <input
            type="number"
            step="0.1"
            min="1"
            {...register('tonnage', {
              required: 'Tonnage is required',
              min: { value: 1, message: 'Minimum 1 ton' },
            })}
            className="form-input"
          />
          {errors.tonnage && <FormError message={errors.tonnage.message} />}
        </div>
        <div className="form-group">
          <label>Cost (USD)</label>
          <input
            type="number"
            step="0.01"
            {...register('cost', { required: 'Cost is required', min: 0 })}
            className="form-input"
          />
          {errors.cost && <FormError message={errors.cost.message} />}
        </div>
        <div className="form-group">
          <label>Dealer Name</label>
          <input
            type="text"
            {...register('dealerName', { required: 'Dealer name is required' })}
            className="form-input"
          />
          {errors.dealerName && <FormError message={errors.dealerName.message} />}
        </div>
        <div className="form-group">
          <label>Branch</label>
          <select
            {...register('branch', { required: 'Branch is required' })}
            className="form-input"
          >
            <option value="">Select Branch</option>
            <option value="maganjo">Maganjo</option>
            <option value="matugga">Matugga</option>
          </select>
          {errors.branch && <FormError message={errors.branch.message} />}
        </div>
        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="tel"
            {...register('contact', {
              required: 'Contact is required',
              pattern: {
                value: /^\+256\d{9}$/,
                message: 'Phone number must be in +256 format followed by 9 digits',
              },
            })}
            className="form-input"
            placeholder="+256123456789"
          />
          {errors.contact && <FormError message={errors.contact.message} />}
        </div>
        <div className="form-group">
          <label>Selling Price (USD/ton)</label>
          <input
            type="number"
            step="0.01"
            {...register('sellingPrice', {
              required: 'Selling price is required',
              min: 0,
            })}
            className="form-input"
          />
          {errors.sellingPrice && <FormError message={errors.sellingPrice.message} />}
        </div>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <div className="table-container">
        <h3>Procurement Records</h3>
        <div className="export-buttons">
          <button onClick={exportToPDF} className="export-button">Export PDF</button>
          <button onClick={exportToCSV} className="export-button">Export CSV</button>
          <button onClick={exportToExcel} className="export-button">Export Excel</button>
        </div>
        {loading && <p>Loading...</p>}
        {data?.data && data.data.length > 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Produce</th>
                  <th>Type</th>
                  <th>Tonnage</th>
                  <th>Cost</th>
                  <th>Dealer</th>
                  <th>Branch</th>
                  <th>Contact</th>
                  <th>Selling Price</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.type}</td>
                    <td>{item.tonnage}</td>
                    <td>${item.cost}</td>
                    <td>{item.dealerName}</td>
                    <td>{item.branch}</td>
                    <td>{item.contact}</td>
                    <td>${item.sellingPrice}</td>
                    <td>{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>
              <span>Page {page} of {data.pages || 1}</span>
              <button
                disabled={page === (data.pages || 1)}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p>No records found.</p>
        )}
      </div>
    </section>
  );
}

export default Procurement;