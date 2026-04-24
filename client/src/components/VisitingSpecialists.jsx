import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.6, delay },
});

const specialists = [
  {
    name: 'Dr. Ravi Teja',
    qualification: 'MDS',
    specialty: 'Orthodontist & Invisalign / Clear Aligners Specialist',
    color: 'from-blue-600 to-blue-400',
  },
  {
    name: 'Dr. Rama Subba Reddy',
    qualification: 'MDS',
    specialty: 'Paedodontist (Child Dental Specialist)',
    color: 'from-teal-600 to-teal-400',
  },
  {
    name: 'Dr. Suresh',
    qualification: 'MDS, FICOI (USA)',
    specialty: 'Oral Medicine & Implantology Specialist',
    color: 'from-indigo-600 to-indigo-400',
  },
  {
    name: 'Dr. Krishnaveni',
    qualification: 'MDS',
    specialty: 'Oral & Maxillofacial Surgeon',
    color: 'from-violet-600 to-violet-400',
  },
  {
    name: 'Dr. Maheshwari',
    qualification: 'MDS',
    specialty: 'Periodontist (Gum Specialist)',
    color: 'from-cyan-600 to-cyan-400',
  },
];

/**
 * VisitingSpecialists — showcases the panel of visiting MDS specialists.
 * Used on both the Home page and the About page.
 */
const VisitingSpecialists = () => (
  <section
    className="py-20 bg-gradient-to-b from-white to-blue-50"
    aria-label="Visiting specialist team"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* ── Section header ─────────────────────────────────────────────── */}
      <motion.div {...fadeUp()} className="text-center mb-12">
        <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-2">
          Specialist Panel
        </p>
        <h2 className="section-title">Visiting Specialist Team</h2>
        <p className="section-subtitle mx-auto max-w-2xl mt-3">
          Multi-Specialty Dental Care Under One Roof at Sekhar's Dental Clinic.
        </p>
        <p className="mt-3 text-slate-500 text-sm max-w-2xl mx-auto">
          Our clinic collaborates with experienced MDS specialists who visit regularly to provide
          advanced and multi-specialty dental care.
        </p>
      </motion.div>

      {/* ── Specialist cards ───────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialists.map(({ name, qualification, specialty, color }, i) => {
          const initials = name
            .replace(/^Dr\.?\s+/i, '')
            .split(' ')
            .slice(0, 2)
            .map((w) => w[0])
            .join('')
            .toUpperCase();

          return (
            <motion.div
              key={name}
              {...fadeUp(i * 0.09)}
              className="bg-white rounded-2xl shadow-card hover:shadow-medical transition-shadow p-6 flex flex-col items-center text-center"
            >
              {/* Avatar */}
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xl font-bold font-heading shadow-md mb-4`}
                aria-hidden="true"
              >
                {initials}
              </div>

              <h3 className="text-base font-bold text-slate-800 font-heading">{name}</h3>
              <p className="text-blue-600 text-xs font-semibold mt-0.5">{qualification}</p>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{specialty}</p>
            </motion.div>
          );
        })}

        {/* 6th slot — CTA card for grid balance */}
        <motion.div
          {...fadeUp(specialists.length * 0.09)}
          className="bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl shadow-card p-6 flex flex-col items-center justify-center text-center text-white"
        >
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
            <Stethoscope className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <p className="font-bold font-heading text-base">Book a Specialist Visit</p>
          <p className="text-blue-100 text-sm mt-2 leading-relaxed">
            Our visiting MDS specialists are available on scheduled days.
          </p>
          <Link
            to="/book-appointment"
            className="mt-4 inline-block bg-white text-blue-700 text-sm font-semibold px-5 py-2 rounded-full hover:bg-blue-50 transition-colors"
          >
            Book Now
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
);

export default VisitingSpecialists;
