const Bill = require('../models/Bill');

const normalizeTreatments = (treatments = []) =>
  treatments
    .filter((item) => item && item.name)
    .map((item) => ({
      name:    String(item.name).trim(),
      toothNo: String(item.toothNo || '').trim(),
      amount:  Number(item.amount) || 0,
    }));

const validateBillPayload = (payload) => {
  const errors = [];

  if (!payload.patientName || payload.patientName.trim().length < 2) {
    errors.push('Patient name is required');
  }
  if (!Number.isFinite(Number(payload.age)) || Number(payload.age) <= 0) {
    errors.push('Valid patient age is required');
  }
  if (!payload.sex || !['Male', 'Female', 'Other'].includes(payload.sex)) {
    errors.push('Sex must be Male, Female, or Other');
  }
  if (!Array.isArray(payload.treatments) || payload.treatments.length === 0) {
    errors.push('At least one treatment item is required');
  }

  return errors;
};

/**
 * Generates a bill number like BILL-20260403-0001
 * by counting how many bills already exist for that date.
 */
const generateBillNo = async (billDate) => {
  const date = new Date(billDate);
  const year  = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day   = String(date.getDate()).padStart(2, '0');
  const key   = `BILL-${year}${month}${day}`;

  const count = await Bill.countDocuments({ billNo: { $regex: `^${key}-` } });
  const sequence = String(count + 1).padStart(4, '0');
  return `${key}-${sequence}`;
};

/**
 * POST /api/admin/bills
 */
const createAdminBill = async (req, res, next) => {
  try {
    const errors = validateBillPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const date            = req.body.date || new Date().toISOString().slice(0, 10);
    const billNo          = await generateBillNo(date);
    const treatments      = normalizeTreatments(req.body.treatments);
    const subtotal        = treatments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const discountPercent = Math.min(100, Math.max(0, Number(req.body.discountPercent) || 0));
    const discountAmount  = Math.round((subtotal * discountPercent) / 100);
    const total           = subtotal - discountAmount;

    const bill = await Bill.create({
      billNo,
      date,
      patientName:     String(req.body.patientName).trim(),
      age:             Number(req.body.age),
      sex:             req.body.sex,
      treatments,
      subtotal,
      discountPercent,
      discountAmount,
      total,
      amountInWords:   String(req.body.amountInWords || '').trim(),
    });

    res.status(201).json({ success: true, data: bill, message: 'Bill created successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/bills
 */
const getAdminBills = async (_req, res, next) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: bills.length, data: bills });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/bills/:id
 */
const getAdminBillById = async (req, res, next) => {
  try {
    const bill = await Bill.findOne({ id: req.params.id }).lean();
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }
    res.json({ success: true, data: bill });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/bills/:id
 */
const updateAdminBill = async (req, res, next) => {
  try {
    const errors = validateBillPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    const existingBill = await Bill.findOne({ id: req.params.id }).lean();
    if (!existingBill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }

    const date            = req.body.date || existingBill.date;
    const treatments      = normalizeTreatments(req.body.treatments);
    const subtotal        = treatments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const discountPercent = Math.min(100, Math.max(0, Number(req.body.discountPercent) || 0));
    const discountAmount  = Math.round((subtotal * discountPercent) / 100);
    const total           = subtotal - discountAmount;

    const updated = await Bill.findOneAndUpdate(
      { id: req.params.id },
      {
        date,
        patientName: String(req.body.patientName).trim(),
        age: Number(req.body.age),
        sex: req.body.sex,
        treatments,
        subtotal,
        discountPercent,
        discountAmount,
        total,
        amountInWords: String(req.body.amountInWords || '').trim(),
      },
      { new: true }
    ).lean();

    res.json({ success: true, data: updated, message: 'Bill updated successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/bills/:id
 */
const deleteAdminBill = async (req, res, next) => {
  try {
    const bill = await Bill.findOneAndDelete({ id: req.params.id }).lean();
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found' });
    }
    res.json({ success: true, message: 'Bill deleted successfully', data: bill });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAdminBill,
  getAdminBills,
  getAdminBillById,
  updateAdminBill,
  deleteAdminBill,
};
