const express = require('express');
const router  = express.Router();
const {
  adminLogin,
  getAppointments,
  getMessages,
  updateAppointmentStatus,
  updateMessageReadStatus,
} = require('../controllers/adminController');
const {
  createAdminBill,
  getAdminBills,
  getAdminBillById,
  updateAdminBill,
  deleteAdminBill,
} = require('../controllers/billController');
const {
  createAdminFaq,
  getAdminFaqs,
  getAdminFaqById,
  updateAdminFaq,
  deleteAdminFaq,
} = require('../controllers/faqController');
const {
  createAdminTestimonial,
  getAdminTestimonials,
  getAdminTestimonialById,
  updateAdminTestimonial,
  deleteAdminTestimonial,
} = require('../controllers/testimonialController');
const {
  createAdminService,
  getAdminServices,
  getAdminServiceById,
  updateAdminService,
  deleteAdminService,
} = require('../controllers/serviceAdminController');
const { authenticate }       = require('../middleware/auth');
const { adminLoginValidation } = require('../middleware/validation');

// POST /api/admin/login  — authenticate and receive JWT
router.post('/login', adminLoginValidation, adminLogin);

// ── Protected routes (require Bearer token) ───────────────────────────────────
router.get('/appointments',                authenticate, getAppointments);
router.get('/messages',                    authenticate, getMessages);
router.patch('/messages/:id/read',         authenticate, updateMessageReadStatus);
router.patch('/appointments/:id/status',   authenticate, updateAppointmentStatus);
router.post('/bills',                       authenticate, createAdminBill);
router.get('/bills',                        authenticate, getAdminBills);
router.get('/bills/:id',                    authenticate, getAdminBillById);
router.put('/bills/:id',                    authenticate, updateAdminBill);
router.delete('/bills/:id',                 authenticate, deleteAdminBill);

router.post('/faqs',                        authenticate, createAdminFaq);
router.get('/faqs',                         authenticate, getAdminFaqs);
router.get('/faqs/:id',                     authenticate, getAdminFaqById);
router.put('/faqs/:id',                     authenticate, updateAdminFaq);
router.delete('/faqs/:id',                  authenticate, deleteAdminFaq);

router.post('/testimonials',                authenticate, createAdminTestimonial);
router.get('/testimonials',                 authenticate, getAdminTestimonials);
router.get('/testimonials/:id',             authenticate, getAdminTestimonialById);
router.put('/testimonials/:id',             authenticate, updateAdminTestimonial);
router.delete('/testimonials/:id',          authenticate, deleteAdminTestimonial);

router.post('/services',                    authenticate, createAdminService);
router.get('/services',                     authenticate, getAdminServices);
router.get('/services/:id',                 authenticate, getAdminServiceById);
router.put('/services/:id',                 authenticate, updateAdminService);
router.delete('/services/:id',              authenticate, deleteAdminService);

module.exports = router;
