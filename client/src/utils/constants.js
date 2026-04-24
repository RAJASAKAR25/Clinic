// ── Clinic information ─────────────────────────────────────────────────────────
// All clinic info is sourced from environment variables via client/src/config.js.
// To change any value, edit client/.env — no code changes needed.
import config from '../config.js';
export const CLINIC = config.clinic;

// ── Navigation links ───────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Home',     path: '/' },
  { label: 'About',    path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Contact',  path: '/contact' },
];

// ── Appointment time slots ─────────────────────────────────────────────────────
const buildTimeSlots = (startHour, startMinute, endHour, endMinute) => {
  const slots = [];
  let currentMinutes = startHour * 60 + startMinute;
  const lastMinutes = endHour * 60 + endMinute;

  while (currentMinutes <= lastMinutes) {
    const hours24 = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12;
    const minuteLabel = String(minutes).padStart(2, '0');

    slots.push(`${hours12}:${minuteLabel} ${period}`);
    currentMinutes += 30;
  }

  return slots;
};

export const WEEKDAY_TIME_SLOTS = buildTimeSlots(9, 0, 21, 0);
export const SUNDAY_TIME_SLOTS = buildTimeSlots(9, 0, 13, 30);
export const TIME_SLOTS = WEEKDAY_TIME_SLOTS;

// ── Service list for appointment dropdown ──────────────────────────────────────
export const SERVICE_LIST = [
  'Teeth Cleaning',
  'Root Canal Treatment',
  'Dental Implants',
  'Teeth Whitening',
  'Braces & Orthodontics',
  'Tooth Extraction',
  'Dental Check-up',
  'Other',
];

// ── Statistics ─────────────────────────────────────────────────────────────────
export const STATS = [
  { number: '2000+', label: 'Happy Patients' },
  { number: '16+',   label: 'Years Experience' },
  { number: '6',     label: 'Expert Services' },
  { number: '85+',   label: 'Positive Reviews' },
];


// ── Services with icon/color metadata (matches server data slugs) ──────────────
export const SERVICE_META = {
  'teeth-cleaning':        { icon: 'Sparkles',    bg: 'bg-blue-50',   icon_color: 'text-blue-600',   border: 'border-blue-100' },
  'root-canal-treatment':  { icon: 'ShieldCheck',  bg: 'bg-green-50',  icon_color: 'text-green-600',  border: 'border-green-100' },
  'dental-implants':       { icon: 'Award',        bg: 'bg-purple-50', icon_color: 'text-purple-600', border: 'border-purple-100' },
  'teeth-whitening':       { icon: 'Sparkles',    bg: 'bg-yellow-50', icon_color: 'text-yellow-500', border: 'border-yellow-100' },
  'braces-orthodontics':   { icon: 'Layers',       bg: 'bg-indigo-50', icon_color: 'text-indigo-600', border: 'border-indigo-100' },
  'tooth-extraction':      { icon: 'Scissors',     bg: 'bg-orange-50', icon_color: 'text-orange-500', border: 'border-orange-100' },
};
