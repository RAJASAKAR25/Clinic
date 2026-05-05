import { motion } from 'framer-motion';
import { GraduationCap, Award, Clock, Star } from 'lucide-react';
import { CLINIC } from '../utils/constants.js';
import doctorImage from '../../assets/DR. Raja.webp';

/**
 * DoctorCard — prominent doctor profile card used on Home & About pages.
 * @param {boolean} compact  - smaller variant for Home page sidebar
 */
const DoctorCard = ({ compact = false }) => {
  const doctorInitials = CLINIC.doctor
    .replace(/^Dr\.?\s+/i, '')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl shadow-medical overflow-hidden border border-sky-100"
    >
      {/* Photo banner */}
      <div className="relative h-72 flex items-end justify-center pb-0" style={{ background: 'linear-gradient(135deg, #114b70, #1f7db8)' }}>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-28 w-56 h-56 rounded-full bg-white ring-4 ring-white shadow-lg overflow-hidden flex items-center justify-center">
          <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-blue-700 font-heading">
            {doctorInitials}
          </span>
          <img
            src={doctorImage}
            alt={CLINIC.doctor}
            className="relative z-10 w-full h-full object-cover object-top"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
      </div>

      <div className="pt-44 pb-6 px-6 text-center">
        <h3 className="text-xl font-bold text-slate-800 font-heading">{CLINIC.doctor}</h3>
        <p className="text-sky-700 font-medium text-sm mt-0.5">{CLINIC.qualification}</p>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" aria-hidden="true" />
          ))}
          <span className="text-xs text-slate-400 ml-1">5.0 (85+ reviews)</span>
        </div>

        {!compact && (
          <p className="text-sm text-slate-500 leading-relaxed mt-3">
            {/* Bio pulled from config — update VITE_CLINIC_DOCTOR_BIO in client/.env */}
            {import.meta.env.VITE_CLINIC_DOCTOR_BIO ||
              `${CLINIC.doctor} is an experienced dental surgeon with over 16 years of clinical experience, known for gentle treatment, honest advice, and patient-centered care.`}
          </p>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { Icon: Clock, value: CLINIC.experience, label: 'Experience' },
            { Icon: Award, value: '20000+', label: 'Patients' },
            { Icon: GraduationCap, value: 'BDS', label: 'Dental Surgeon' },
          ].map(({ Icon, value, label }) => (
            <div key={label} className="bg-sky-50 rounded-xl p-3 text-center">
              <Icon className="w-4 h-4 text-sky-600 mx-auto mb-1" aria-hidden="true" />
              <p className="text-sm font-bold text-slate-800">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
