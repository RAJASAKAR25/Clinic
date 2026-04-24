import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import signImg from '../../assets/Sign.webp';
import { Eye, Trash2, LayoutDashboard, ReceiptText, Plus, Printer, FileDown, Pencil } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import toast from 'react-hot-toast';
import { deleteAdminBill, getAdminBillById, getAdminBills } from '../services/api.js';
import { formatINRCurrency } from '../utils/billing.js';
import config from '../config.js';
import clinicLogo from '../../assets/Clinic_Logo.svg';

const BillsHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const billRef = useRef(null);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const response = await getAdminBills();
      setBills(response.data?.data || []);
    } catch {
      toast.error('Failed to load bills history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleView = async (id) => {
    try {
      const response = await getAdminBillById(id);
      setSelectedBill(response.data?.data || null);
    } catch {
      toast.error('Unable to load bill details');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this bill permanently?');
    if (!confirmed) return;

    try {
      await deleteAdminBill(id);
      setBills((prev) => prev.filter((bill) => bill.id !== id));
      if (selectedBill?.id === id) {
        setSelectedBill(null);
      }
      toast.success('Bill deleted');
    } catch {
      toast.error('Unable to delete bill');
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: billRef,
    documentTitle: selectedBill?.billNo || 'bill',
    pageStyle: '@page { size: A4; margin: 0; }',
  });

  const handleDownloadPdf = async () => {
    if (!selectedBill || !billRef.current) return;

    let prevMinHeight = '';
    let prevHeight = '';
    let prevMargin = '';
    try {
      const module = await import('html2pdf.js');
      const html2pdf = module.default;

      const exportNode = billRef.current;
      prevMinHeight = exportNode.style.minHeight;
      prevHeight = exportNode.style.height;
      prevMargin = exportNode.style.margin;
      exportNode.style.minHeight = 'auto';
      exportNode.style.height = 'auto';
      exportNode.style.margin = '0';

      const targetWidth = exportNode.scrollWidth;
      const targetHeight = exportNode.scrollHeight;

      await html2pdf()
        .set({
          margin: [0, 0, 0, 0],
          filename: `${selectedBill.billNo}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: targetWidth,
            windowHeight: targetHeight,
          },
          pagebreak: { mode: ['css', 'legacy'] },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(exportNode)
        .save();
    } catch {
      toast.error('Unable to generate PDF right now');
    } finally {
      if (billRef.current) {
        billRef.current.style.minHeight = prevMinHeight;
        billRef.current.style.height = prevHeight;
        billRef.current.style.margin = prevMargin;
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="bg-white rounded-2xl shadow-card p-4 md:p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Super Admin</p>
            <h1 className="text-xl font-bold text-slate-800">Bills History</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/dashboard" className="btn-secondary !px-4 !py-2 text-xs">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link to="/admin/billing" className="btn-primary !px-4 !py-2 text-xs">
              <Plus className="w-4 h-4" />
              New Bill
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5 items-start">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-slate-500">Loading billing records...</div>
            ) : bills.length === 0 ? (
              <div className="p-10 text-center text-slate-500">No bills available yet.</div>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Bill No</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Patient</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Total</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bills.map((bill) => (
                      <tr key={bill.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">{bill.billNo}</td>
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{bill.date}</td>
                        <td className="px-4 py-3 text-slate-700">{bill.patientName}</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-700">{formatINRCurrency(bill.total)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              className="p-2 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => handleView(bill.id)}
                              aria-label={`View ${bill.billNo}`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              className="p-2 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              onClick={() => navigate(`/admin/billing?edit=${bill.id}`)}
                              aria-label={`Edit ${bill.billNo}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(bill.id)}
                              aria-label={`Delete ${bill.billNo}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <aside className="bg-white rounded-2xl shadow-card p-5 min-h-[280px]">
            {!selectedBill ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                <ReceiptText className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-sm">Select a bill to view details</p>
              </div>
            ) : (
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <button type="button" onClick={handlePrint} className="btn-secondary !px-3 !py-2 text-xs">
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                  <button type="button" onClick={handleDownloadPdf} className="btn-secondary !px-3 !py-2 text-xs">
                    <FileDown className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>

                <h2 className="text-base font-bold text-slate-800">{selectedBill.billNo}</h2>
                <p className="text-xs text-slate-500 mt-1">{selectedBill.date}</p>
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <p><span className="font-semibold">Patient:</span> {selectedBill.patientName}</p>
                  <p><span className="font-semibold">Age/Sex:</span> {selectedBill.age} / {selectedBill.sex}</p>
                </div>

                <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-2 py-2 text-left">Treatment</th>
                        <th className="px-2 py-2 text-center">Tooth</th>
                        <th className="px-2 py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBill.treatments.map((item, idx) => (
                        <tr key={`${item.name}-${idx}`} className="border-t border-slate-100">
                          <td className="px-2 py-2">{item.name}</td>
                          <td className="px-2 py-2 text-center">{item.toothNo || '-'}</td>
                          <td className="px-2 py-2 text-right">{formatINRCurrency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-slate-200 bg-slate-50">
                        <td colSpan={2} className="px-2 py-2 text-right text-slate-500 text-xs">Subtotal</td>
                        <td className="px-2 py-2 text-right text-slate-600">{formatINRCurrency(selectedBill.subtotal ?? selectedBill.total)}</td>
                      </tr>
                      {selectedBill.discountPercent > 0 && (
                        <tr className="border-t border-slate-100">
                          <td colSpan={2} className="px-2 py-2 text-right text-green-600 text-xs">Discount ({selectedBill.discountPercent}%)</td>
                          <td className="px-2 py-2 text-right text-green-600">− {formatINRCurrency(selectedBill.discountAmount)}</td>
                        </tr>
                      )}
                      <tr className="border-t-2 border-slate-300 bg-slate-100">
                        <td colSpan={2} className="px-2 py-2 text-right font-semibold">Net Total</td>
                        <td className="px-2 py-2 text-right font-bold">{formatINRCurrency(selectedBill.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <p className="mt-3 text-xs text-slate-500">{selectedBill.amountInWords}</p>
              </div>
            )}
          </aside>
        </div>

        {selectedBill && (
          <div className="fixed -left-[9999px] top-0 pointer-events-none">
            <div ref={billRef} className="billing-a4 bg-white text-black p-8">
              <header className="border-b border-slate-300 pb-4">
                <div className="flex justify-between gap-6">
                  <div className="flex items-start gap-3">
                    <img src={clinicLogo} alt="Clinic logo" className="w-16 h-16 object-contain" />
                    <div>
                      <h2 className="text-2xl font-bold tracking-wide">Sekhar's Dental Clinic</h2>
                      <p className="text-xs text-slate-700 leading-relaxed mt-1">{config.clinic.address}</p>
                      <p className="text-xs text-slate-700">Phone: {config.clinic.phone}</p>
                    </div>
                  </div>

                  <div className="text-right text-xs leading-relaxed">
                    <p><span className="font-semibold">Date:</span> {selectedBill.date}</p>
                    <p><span className="font-semibold">Bill No:</span> {selectedBill.billNo}</p>
                  </div>
                </div>

                <div className="mt-4 text-sm font-medium flex items-center justify-between gap-4">
                  <p>Dr. RAJASAKAR, BDS</p>
                  <p>Reg No: A-5360</p>
                </div>
              </header>

              <section className="mt-4 border border-slate-300">
                <div className="grid grid-cols-3 text-sm">
                  <div className="p-2 border-r border-slate-300"><span className="font-semibold">Patient Name:</span> {selectedBill.patientName || '-'}</div>
                  <div className="p-2 border-r border-slate-300"><span className="font-semibold">Age:</span> {selectedBill.age || '-'}</div>
                  <div className="p-2"><span className="font-semibold">Sex:</span> {selectedBill.sex || '-'}</div>
                </div>
              </section>

              <section className="mt-4">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#007ea8] text-white">
                      <th className="border border-[#4ea8c4] px-2 py-2 w-12">S.No</th>
                      <th className="border border-[#4ea8c4] px-2 py-2 text-left">Treatment</th>
                      <th className="border border-[#4ea8c4] px-2 py-2 w-28">Tooth No.</th>
                      <th className="border border-[#4ea8c4] px-2 py-2 w-36 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedBill.treatments || []).map((item, index) => (
                      <tr key={`${item.name}-${index}`}>
                        <td className="border border-slate-300 px-2 py-2 text-center">{index + 1}</td>
                        <td className="border border-slate-300 px-2 py-2">{item.name || '-'}</td>
                        <td className="border border-slate-300 px-2 py-2 text-center">{item.toothNo || '-'}</td>
                        <td className="border border-slate-300 px-2 py-2 text-right">{formatINRCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="border border-slate-300 px-2 py-1.5 text-right text-slate-600">Subtotal</td>
                      <td className="border border-slate-300 px-2 py-1.5 text-right">{formatINRCurrency(selectedBill.subtotal ?? selectedBill.total)}</td>
                    </tr>
                    {selectedBill.discountPercent > 0 && (
                      <tr>
                        <td colSpan={3} className="border border-slate-300 px-2 py-1.5 text-right text-slate-600">Discount ({selectedBill.discountPercent}%)</td>
                        <td className="border border-slate-300 px-2 py-1.5 text-right text-green-700">− {formatINRCurrency(selectedBill.discountAmount)}</td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={3} className="border border-slate-400 px-2 py-2 text-right font-semibold">Net Total</td>
                      <td className="border border-slate-400 px-2 py-2 text-right font-bold">{formatINRCurrency(selectedBill.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </section>

              <section className="mt-4 text-sm">
                <p className="font-semibold">Amount in Words:</p>
                <p>{selectedBill.amountInWords}</p>
              </section>

              <footer className="mt-10 text-sm">
                <p className="mb-4">Received with thanks</p>
                <div className="grid grid-cols-2 gap-10">
                  <div className="flex flex-col justify-end">
                    <div className="flex justify-center mb-1">
                      <img src={signImg} alt="Signature" className="h-16 object-contain pointer-events-none" />
                    </div>
                    <p className="border-t border-slate-500 pt-2 text-center">Signature</p>
                  </div>
                  <div className="flex flex-col justify-end">
                    <p className="border-t border-slate-500 pt-2 text-center">Clinic Seal</p>
                  </div>
                </div>
                <div className="bill-footer-strip mt-8 rounded-md bg-gradient-to-r from-sky-700 to-cyan-600 px-4 py-2 text-center text-[11px] font-medium text-white leading-relaxed">
                  <p>{config.clinic.address}</p>
                  <p>Phone: {config.clinic.phone}</p>
                </div>
              </footer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillsHistory;
