/**
 * Shared constants used by the backend.
 */

const CLINIC_INFO = {
  name: "Shekar's Dental Clinic",
  doctor: 'Dr. Rajasakar',
  qualification: 'BDS | Dental Surgeon',
  location: 'Nehru Bazar, opp. Uday Satvision, Markapur, Andhra Pradesh 523316',
  phone: '+91 7842299457',
  whatsapp: '917842299457',
  email: 'Cox_408@yahoo.co.in',
  hours: {
    weekdays: 'Mon–Sat: 9:00 AM – 7:00 PM',
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
