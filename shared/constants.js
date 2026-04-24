/**
 * Shared constants used by both frontend and backend.
 * Keep in sync manually or use a build step to import.
 */

const CLINIC_INFO = {
  name: 'SmileCare Dental Clinic',
  doctor: 'Dr. Ankit Gautam',
  qualification: 'BDS, MDS (Prosthodontics)',
  location: 'Gomti Nagar, Lucknow, Uttar Pradesh, India',
  phone: '+91 9876543210',
  whatsapp: '919876543210',
  email: 'contact@smilecareclinic.com',
  hours: {
    weekdays: 'Mon–Sat: 9:00 AM – 9:00 PM',
    sunday: 'Sunday: 9:00 AM – 1:30 PM',
  },
};

const SERVICE_SLUGS = [
  'teeth-cleaning',
  'root-canal-treatment',
  'dental-implants',
  'teeth-whitening',
  'braces-orthodontics',
  'tooth-extraction',
];

const APPOINTMENT_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

module.exports = { CLINIC_INFO, SERVICE_SLUGS, APPOINTMENT_STATUSES };
