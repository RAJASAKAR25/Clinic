import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useReactToPrint } from 'react-to-print';
import signImg from '../../assets/Sign.webp';
import stampImg from '../../assets/Clinic_Stamp.webp';
import {
  Plus,
  Trash2,
  Save,
  Printer,
  FileDown,
  ArrowLeft,
  History,
  LayoutDashboard,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';
import config from '../config.js';
import { createAdminBill, getAdminBillById, updateAdminBill } from '../services/api.js';
import {
  amountToWordsINR,
  BILL_TREATMENT_OPTIONS,
  formatINRCurrency,
} from '../utils/billing.js';
import clinicLogo from '../../assets/Clinic_Logo.svg';

const todayIso = () => new Date().toISOString().slice(0, 10);

const dateKey = (dateValue) => {
  const date = new Date(dateValue || new Date());
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

const AdminBilling = () => {
  const [searchParams] = useSearchParams();
  const editBillId = searchParams.get('edit');
  const [saving, setSaving] = useState(false);
  const [savedBill, setSavedBill] = useState(null);
  const [loadingBill, setLoadingBill] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);
  // patientPhone is stored only in local state — it is NEVER saved to DB or shown on bill
  const [patientPhone, setPatientPhone] = useState('');

  const billRef = useRef(null);

  const {
    control,
    register,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: todayIso(),
      patientName: '',
      age: '',
      sex: 'Male',
      discountPercent: 0,
      treatments: [{ name: 'Consultation', customName: '', toothNo: '', amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'treatments',
  });

  const treatments = useWatch({ control, name: 'treatments' }) || [];
  const date = useWatch({ control, name: 'date' });
  const patientName = useWatch({ control, name: 'patientName' });
  const age = useWatch({ control, name: 'age' });
  const sex = useWatch({ control, name: 'sex' });
  const discountPercent = Number(useWatch({ control, name: 'discountPercent' })) || 0;

  const subtotal = useMemo(
    () => treatments.reduce((sum, item) => sum + (Number(item?.amount) || 0), 0),
    [treatments]
  );

  const discountAmount = useMemo(
    () => Math.round((subtotal * Math.min(100, Math.max(0, discountPercent))) / 100),
    [subtotal, discountPercent]
  );

  const total = subtotal - discountAmount;

  const amountInWords = useMemo(() => amountToWordsINR(total), [total]);
  const previewBillNo = savedBill?.billNo || (editBillId ? `BILL-${dateKey(date)}-EDIT` : `BILL-${dateKey(date)}-AUTO`);

  useEffect(() => {
    if (!editBillId) return;

    let isMounted = true;
    const loadBillForEdit = async () => {
      setLoadingBill(true);
      try {
        const response = await getAdminBillById(editBillId);
        const bill = response.data?.data;
        if (!bill || !isMounted) return;

        const normalizedTreatments = (bill.treatments || []).map((item) => {
          const isKnown = BILL_TREATMENT_OPTIONS.includes(item.name) && item.name !== 'Other';
          return {
            name: isKnown ? item.name : 'Other',
            customName: isKnown ? '' : (item.name || ''),
            toothNo: item.toothNo || '',
            amount: Number(item.amount) || 0,
          };
        });

        reset({
          date: bill.date || todayIso(),
          patientName: bill.patientName || '',
          age: String(bill.age || ''),
          sex: bill.sex || 'Male',
          discountPercent: Number(bill.discountPercent) || 0,
          treatments: normalizedTreatments.length
            ? normalizedTreatments
            : [{ name: 'Consultation', customName: '', toothNo: '', amount: 0 }],
        });

        setSavedBill(bill);
      } catch {
        toast.error('Unable to load bill for editing');
      } finally {
        if (isMounted) setLoadingBill(false);
      }
    };

    loadBillForEdit();

    return () => {
      isMounted = false;
    };
  }, [editBillId, reset]);

  const onSelectTreatment = (index, selectedTreatment) => {
    setValue(`treatments.${index}.name`, selectedTreatment, { shouldDirty: true });
    setValue(`treatments.${index}.customName`, selectedTreatment === 'Other' ? '' : '', { shouldDirty: true });
  };

  const handlePrint = useReactToPrint({
    contentRef: billRef,
    documentTitle: `${previewBillNo}`,
    pageStyle: '@page { size: A4; margin: 0; }',
  });

  /**
   * Shared helper: restores the bill node's inline styles after PDF export.
   */
  const _restoreBillNodeStyles = (node, prev) => {
    if (!node) return;
    node.style.minHeight = prev.minHeight;
    node.style.height = prev.height;
    node.style.margin = prev.margin;
  };

  /**
   * Shared helper: prepares the bill node and builds html2pdf options.
   * Returns { html2pdf, exportNode, options, prev } or throws.
   */
  const _preparePdfExport = async (filename) => {
    if (!billRef.current) throw new Error('No bill element');
    const module = await import('html2pdf.js');
    const html2pdf = module.default;
    const exportNode = billRef.current;
    const prev = {
      minHeight: exportNode.style.minHeight,
      height: exportNode.style.height,
      margin: exportNode.style.margin,
    };
    exportNode.style.minHeight = 'auto';
    exportNode.style.height = 'auto';
    exportNode.style.margin = '0';
    const options = {
      margin: [0, 0, 0, 0],
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: exportNode.scrollWidth,
        windowHeight: exportNode.scrollHeight,
      },
      pagebreak: { mode: ['css', 'legacy'] },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    return { html2pdf, exportNode, options, prev };
  };

  const handleDownloadPdf = async () => {
    let prev = {};
    let node = null;
    try {
      const { html2pdf, exportNode, options, prev: p } = await _preparePdfExport(`${previewBillNo}.pdf`);
      prev = p;
      node = exportNode;
      await html2pdf().set(options).from(exportNode).save();
    } catch {
      toast.error('Unable to generate PDF right now');
    } finally {
      _restoreBillNodeStyles(node, prev);
    }
  };

  /**
   * Generates the bill PDF as a Blob then opens a WhatsApp deep-link
   * so the file can be shared directly to the patient's number.
   * The phone number is ONLY used here and is never stored or printed.
   */
  const handleSendWhatsApp = async () => {
    const raw = patientPhone.trim().replace(/\s+/g, '');
    if (!raw) {
      toast.error('Please enter a patient phone number first');
      return;
    }
    // Accept Indian numbers with or without country code
    const phoneDigits = raw.replace(/[^\d+]/g, '');
    const e164 = phoneDigits.startsWith('+') ? phoneDigits.slice(1) : `91${phoneDigits}`;
    if (e164.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setSendingWhatsApp(true);
    let prev = {};
    let node = null;
    try {
      const { html2pdf, exportNode, options, prev: p } = await _preparePdfExport(`${previewBillNo}.pdf`);
      prev = p;
      node = exportNode;

      // Generate blob
      const blob = await html2pdf().set(options).from(exportNode).outputPdf('blob');

      // Try Web Share API (mobile) — fallback to wa.me link
      const pdfFile = new File([blob], `${previewBillNo}.pdf`, { type: 'application/pdf' });
      const message = encodeURIComponent(
        `Dear Patient, please find your bill from Sekhar's Dental Clinic attached below. Bill No: ${previewBillNo}`
      );

      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          title: `Bill ${previewBillNo}`,
          text: `Bill from Sekhar's Dental Clinic — ${previewBillNo}`,
          files: [pdfFile],
        });
      } else {
        // Fallback: download the PDF first, then open WhatsApp link
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${previewBillNo}.pdf`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
        window.open(`https://api.whatsapp.com/send/?phone=${e164}&text=${message}&type=phone_number&app_absent=0`, '_blank', 'noopener,noreferrer');
        toast.success('PDF downloaded — please attach it in the WhatsApp chat that just opened');
      }
    } catch (err) {
      if (err?.name !== 'AbortError') {
        toast.error('Unable to send via WhatsApp right now');
      }
    } finally {
      _restoreBillNodeStyles(node, prev);
      setSendingWhatsApp(false);
    }
  };

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      const payload = {
        date: values.date,
        patientName: values.patientName,
        age: Number(values.age),
        sex: values.sex,
        discountPercent: Math.min(100, Math.max(0, Number(values.discountPercent) || 0)),
        treatments: values.treatments.map((row) => ({
          name: row.name === 'Other' ? String(row.customName || '').trim() : row.name,
          toothNo: row.toothNo || '',
          amount: Number(row.amount) || 0,
        })),
        amountInWords,
      };

      const hasCustomTreatment = payload.treatments.some((row, index) => values.treatments[index]?.name === 'Other' && !row.name);

      if (hasCustomTreatment) {
        toast.error('Please enter a service name for Other treatment');
        setSaving(false);
        return;
      }

      const response = editBillId
        ? await updateAdminBill(editBillId, payload)
        : await createAdminBill(payload);

      setSavedBill(response.data?.data || null);
      toast.success(editBillId ? 'Bill updated successfully' : 'Bill saved successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save bill';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="bg-white rounded-2xl shadow-card p-4 md:p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Super Admin</p>
            <h1 className="text-xl font-bold text-slate-800">{editBillId ? 'Edit Bill' : 'Billing System'}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/dashboard" className="btn-secondary !px-4 !py-2 text-xs">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link to="/admin/bills-history" className="btn-secondary !px-4 !py-2 text-xs">
              <History className="w-4 h-4" />
              Bills History
            </Link>
            <Link to="/admin/dashboard" className="btn-secondary !px-4 !py-2 text-xs">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[370px_minmax(0,1fr)] gap-5 items-start">
          {loadingBill ? (
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-card p-10 text-center text-slate-500">Loading bill details...</div>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-card p-5 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="form-label" htmlFor="date">Bill Date</label>
                    <input id="date" type="date" className="input-field" {...register('date', { required: true })} />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="sex">Sex</label>
                    <select id="sex" className="input-field" {...register('sex', { required: true })}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="patientName">Patient Name</label>
                  <input
                    id="patientName"
                    className={`input-field ${errors.patientName ? 'input-field-error' : ''}`}
                    placeholder="Enter patient name"
                    {...register('patientName', {
                      required: 'Patient name is required',
                      minLength: { value: 2, message: 'Minimum 2 characters' },
                    })}
                  />
                  {errors.patientName && <p className="form-error">{errors.patientName.message}</p>}
                </div>

                {/* Patient phone — for WhatsApp delivery only, never stored or printed */}
                <div>
                  <label className="form-label" htmlFor="patientPhone">
                    Patient Phone
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">+91</span>
                    <input
                      id="patientPhone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      className="input-field pl-10"
                      placeholder="Enter patient phone number"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Enter 10-digit mobile number to send the bill via WhatsApp.
                  </p>
                </div>

                <div>
                  <label className="form-label" htmlFor="age">Age</label>
                  <input
                    id="age"
                    type="number"
                    min="1"
                    className={`input-field ${errors.age ? 'input-field-error' : ''}`}
                    placeholder="Enter age"
                    {...register('age', {
                      required: 'Age is required',
                      min: { value: 1, message: 'Age must be at least 1' },
                    })}
                  />
                  {errors.age && <p className="form-error">{errors.age.message}</p>}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-700">Treatments</h2>
                    <button
                      type="button"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                      onClick={() => append({ name: 'Consultation', customName: '', toothNo: '', amount: 0 })}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Row
                    </button>
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="border border-slate-200 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-500">Row {index + 1}</p>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700"
                            aria-label={`Delete treatment row ${index + 1}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <select
                        className="input-field"
                        {...register(`treatments.${index}.name`, { required: true })}
                        onChange={(event) => onSelectTreatment(index, event.target.value)}
                      >
                        {BILL_TREATMENT_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>

                      {treatments[index]?.name === 'Other' && (
                        <input
                          className="input-field"
                          placeholder="Enter service name"
                          {...register(`treatments.${index}.customName`, {
                            required: 'Service name is required for Other',
                          })}
                        />
                      )}

                      <input
                        className="input-field"
                        placeholder="Tooth No"
                        {...register(`treatments.${index}.toothNo`)}
                      />

                      <input
                        type="number"
                        min="0"
                        className="input-field"
                        placeholder="Amount"
                        {...register(`treatments.${index}.amount`, { min: 0 })}
                      />
                    </div>
                  ))}
                </div>

                {/* Discount field */}
                <div>
                  <label className="form-label" htmlFor="discountPercent">
                    Discount % <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="discountPercent"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      className="input-field pr-10"
                      placeholder="0"
                      {...register('discountPercent', { min: 0, max: 100 })}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">%</span>
                  </div>
                </div>

                {/* Summary box */}
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1.5">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>{formatINRCurrency(subtotal)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({discountPercent}%)</span>
                      <span>− {formatINRCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline border-t border-slate-200 pt-1.5 mt-1.5">
                    <span className="text-sm font-semibold text-slate-700">Net Total</span>
                    <span className="text-xl font-bold text-slate-800">{formatINRCurrency(total)}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{amountInWords}</p>
                </div>

                <button type="submit" disabled={saving} className="btn-primary w-full justify-center disabled:opacity-60">
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : editBillId ? 'Update Bill' : 'Save Bill'}
                </button>
              </form>

              <div className="space-y-3">
                <div className="bg-white rounded-2xl shadow-card p-3 flex flex-wrap gap-2 print:hidden">
                  <button type="button" onClick={handlePrint} className="btn-secondary !px-4 !py-2 text-xs">
                    <Printer className="w-4 h-4" />
                    Print A4
                  </button>
                  <button type="button" onClick={handleDownloadPdf} className="btn-secondary !px-4 !py-2 text-xs">
                    <FileDown className="w-4 h-4" />
                    Download PDF
                  </button>
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    disabled={sendingWhatsApp}
                    title={patientPhone ? `Send to +91 ${patientPhone} via WhatsApp` : 'Enter patient phone number to enable'}
                    className="btn-secondary !px-4 !py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.9 12.9 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {sendingWhatsApp ? 'Preparing...' : 'Send via WhatsApp'}
                  </button>
                  {savedBill?.billNo && (
                    <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg font-semibold">
                      Saved: {savedBill.billNo}
                    </span>
                  )}
                </div>

                <div className="overflow-auto border border-slate-200 rounded-2xl bg-slate-50 p-4">
                  <div ref={billRef} className="billing-a4 mx-auto bg-white text-black p-8">
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
                          <p><span className="font-semibold">Date:</span> {date || todayIso()}</p>
                          <p><span className="font-semibold">Bill No:</span> {previewBillNo}</p>
                        </div>
                      </div>

                      <div className="mt-4 text-sm font-medium flex items-center justify-between gap-4">
                        <p>Dr. RAJASAKAR, BDS</p>
                        <p>Reg No: A-5360</p>
                      </div>
                    </header>

                    <section className="mt-4 border border-slate-300">
                      <div className="grid grid-cols-3 text-sm">
                        <div className="p-2 border-r border-slate-300"><span className="font-semibold">Patient Name:</span> {patientName || '-'}</div>
                        <div className="p-2 border-r border-slate-300"><span className="font-semibold">Age:</span> {age || '-'}</div>
                        <div className="p-2"><span className="font-semibold">Sex:</span> {sex || '-'}</div>
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
                          {treatments.map((item, index) => (
                            <tr key={`${item?.name || 'row'}-${index}`}>
                              <td className="border border-slate-300 px-2 py-2 text-center">{index + 1}</td>
                              <td className="border border-slate-300 px-2 py-2">
                                {item?.name === 'Other' ? item?.customName || 'Other' : item?.name || '-'}
                              </td>
                              <td className="border border-slate-300 px-2 py-2 text-center">{item?.toothNo || '-'}</td>
                              <td className="border border-slate-300 px-2 py-2 text-right">{formatINRCurrency(item?.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={3} className="border border-slate-300 px-2 py-1.5 text-right text-slate-600">Subtotal</td>
                            <td className="border border-slate-300 px-2 py-1.5 text-right">{formatINRCurrency(subtotal)}</td>
                          </tr>
                          {discountPercent > 0 && (
                            <tr>
                              <td colSpan={3} className="border border-slate-300 px-2 py-1.5 text-right text-slate-600">Discount ({discountPercent}%)</td>
                              <td className="border border-slate-300 px-2 py-1.5 text-right text-green-700">− {formatINRCurrency(discountAmount)}</td>
                            </tr>
                          )}
                          <tr>
                            <td colSpan={3} className="border border-slate-400 px-2 py-2 text-right font-semibold">Net Total</td>
                            <td className="border border-slate-400 px-2 py-2 text-right font-bold">{formatINRCurrency(total)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </section>

                    <section className="mt-4 text-sm">
                      <p className="font-semibold">Amount in Words:</p>
                      <p>{amountInWords}</p>
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
                          <div className="flex justify-center mb-1">
                            <img src={stampImg} alt="Clinic Stamp" className="h-16 object-contain pointer-events-none" />
                          </div>
                          <p className="border-t border-slate-500 pt-2 text-center">Clinic Seal</p>
                        </div>
                      </div>
                      <div className="bill-footer-strip mt-8 rounded-md bg-gradient-to-r from-sky-700 to-cyan-600 px-4 py-2 text-center text-[11px] font-medium text-white leading-relaxed">
                        <p>{config.clinic.address}</p>
                        <p>
                          <a href={`tel:${config.clinic.phone}`} className="no-underline text-white hover:text-sky-100">Phone: {config.clinic.phone}</a> &nbsp;|&nbsp;{' '}
                          Email: <a href="mailto:Cox_408@yahoo.co.in" className="no-underline text-white hover:text-sky-100">Cox_408@yahoo.co.in</a> &nbsp;|&nbsp;{' '}
                          Web: <a href="https://www.sekhardental.com" target="_blank" rel="noopener noreferrer" className="no-underline text-white hover:text-sky-100">www.sekhardental.com</a>
                        </p>
                      </div>
                    </footer>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBilling;
