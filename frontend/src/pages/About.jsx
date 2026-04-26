import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Award, Heart, Users, CheckCircle2, Calendar,
} from 'lucide-react';
import SEOMeta               from '../components/SEOMeta.jsx';
import DoctorCard             from '../components/DoctorCard.jsx';
import VisitingSpecialists    from '../components/VisitingSpecialists.jsx';
import { CLINIC } from '../utils/constants.js';

import imgReceptionWaiting from '../../assets/Clinic _Reception_And_Waiting_Area.webp';
import imgXray from '../../assets/Clinic_Dental_X-ray.webp';
import imgSterilisation from '../../assets/Clinic_Sterilisation_Unit.webp';
import imgChairOne from '../../assets/Clinic_Treatment_Room_Chair_One.webp';
import imgChairTwo from '../../assets/Clinic_Treatment_Room_Chair_Two.webp';
import imgConsultation from '../../assets/Clinic_Consultation_Room.webp';

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 30 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true },
  transition: { duration: 0.6, delay },
});

/* ── Qualifications list ──────────────────────────────────────────────────── */
const qualifications = [
  { icon: GraduationCap, label: 'BDS', detail: 'Bachelor of Dental Surgery' },
  { icon: Award,         label: 'Dental Surgeon', detail: 'Comprehensive Dental Care' },
  { icon: Users,         label: '16+ Years', detail: 'Clinical Experience' },
  { icon: Heart,         label: '85+', detail: 'Positive Patient Reviews' },
];

/* ── Values ───────────────────────────────────────────────────────────────── */
const values = [
  { title: 'Patient-First',     desc: 'Every decision is guided by what is best for you — medically and personally.' },
  { title: 'Painless Care',     desc: 'We invest in the latest anaesthesia and techniques so you stay comfortable.' },
  { title: 'Honest Advice',     desc: 'We only recommend treatments you genuinely need, clearly explained.' },
  { title: 'Continued Learning',desc: 'Dr. Rajasakar regularly attends implant training programs and dental conferences.' },
];

const About = () => (
  <>
    <SEOMeta
      title="About Us"
      description="Learn about Sekhar's Dental Clinic and Dr. Rajasakar — BDS | Dental Surgeon — providing expert dental care in Markapur, Andhra Pradesh."
      canonical="/about"
    />

    {/* Page header */}
    <header className="page-header" aria-label="About page header">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-3xl mx-auto px-4">
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-sky-200 text-sm font-semibold uppercase tracking-widest mb-3"
        >
          About Us
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading"
        >
          Meet the Doctor & Our Story
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="text-sky-100 mt-4 text-base sm:text-lg max-w-xl mx-auto"
        >
          A decade of dedication to crafting healthier, brighter smiles in Markapur.
        </motion.p>
      </div>
    </header>

    {/* Doctor section */}
    <section className="py-16 sm:py-20 bg-white" aria-label="Doctor profile">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <motion.div {...fadeUp()}>
            <DoctorCard />
          </motion.div>

          <div className="space-y-6">
            <motion.div {...fadeUp(0.1)}>
              <p className="text-sky-700 text-sm font-semibold uppercase tracking-widest mb-2">
                About the Doctor
              </p>
              <h2 className="text-3xl font-bold text-slate-800 font-heading">
                {CLINIC.doctor}
              </h2>
              <p className="text-sky-700 font-medium mt-1">{CLINIC.qualification}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['16+ Years Experience', 'Patient-First Care', 'Advanced Sterilisation'].map((pill) => (
                  <span key={pill} className="text-xs font-semibold text-sky-800 bg-sky-50 border border-sky-100 rounded-full px-3 py-1.5">
                    {pill}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.15)} className="space-y-4 text-slate-600 text-base leading-relaxed">
              <p>
                Dr. Rajasakar is an experienced dental surgeon with over 16 years of clinical
                experience in providing comprehensive dental care. Throughout his career, he has
                treated thousands of patients across Markapuram and surrounding areas, earning a
                reputation for gentle treatment, honest advice, and patient-centered care.
              </p>
              <p>
                He completed his Bachelor of Dental Surgery (BDS) and has continuously upgraded
                his knowledge by attending advanced implant training programs, dental conferences,
                and clinical workshops to stay updated with modern dental techniques and
                technologies.
              </p>
              <p>
                Dr. Rajasakar strongly believes that every patient deserves comfortable,
                transparent, and high-quality dental care. His approach focuses on accurate
                diagnosis, clear explanation of treatment options, and ensuring that patients
                feel relaxed and confident during their dental visits.
              </p>
              <p>
                Under his leadership, Sekhar's Dental Clinic has grown into a trusted dental
                center known for modern equipment, strict sterilization protocols, and
                personalized treatment planning.
              </p>
              <p>
                With 85+ positive patient reviews and over a decade and a half of experience,
                Dr. Rajasakar continues to serve the community with dedication, helping patients
                achieve healthy smiles and long-lasting dental health.
              </p>
            </motion.div>

            {/* Qualifications grid */}
            <motion.div {...fadeUp(0.2)} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {qualifications.map(({ icon: Icon, label, detail }) => (
                <div key={label} className="flex items-center gap-3 bg-sky-50 p-4 rounded-2xl border border-sky-100">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Icon className="w-5 h-5 text-sky-700" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{label}</p>
                    <p className="text-xs text-slate-500">{detail}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>

    {/* Visiting Specialists */}
    <VisitingSpecialists />

    {/* Clinic Story */}
    <section className="py-16 sm:py-20 bg-sky-50/55" aria-label="Clinic story">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <p className="text-sky-700 text-sm font-semibold uppercase tracking-widest mb-2">Our Story</p>
          <h2 className="section-title">A New Chapter in Markapur</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div {...fadeUp(0.1)} className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              Sekhar's Dental Clinic was founded with one mission: to make quality dental care
              accessible, comfortable, and affordable for every family in Markapur.
            </p>
            <p>
              After years of successful practice, Dr. Rajasakar made the exciting decision
              to move the clinic to a larger, more modern space in Nehru Bazar, Markapur.
            </p>
            <p>
              The new clinic is equipped with digital X-rays, air-conditioned treatment rooms,
              a dedicated children's dental area, and a welcoming reception lounge — all
              designed to make every visit a pleasant experience.
            </p>
            <div className="pt-2">
              <Link to="/book-appointment" className="btn-primary">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                Book Your Visit
              </Link>
            </div>
          </motion.div>

          {/* Values */}
          <motion.div {...fadeUp(0.2)} className="space-y-4">
            {values.map((v) => (
              <div key={v.title} className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-card border border-sky-100">
                <CheckCircle2 className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-slate-800">{v.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    {/* Clinic Gallery */}
    <section className="py-16 sm:py-20 bg-white" aria-label="Clinic facilities gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <p className="text-sky-700 text-sm font-semibold uppercase tracking-widest mb-2">Facilities</p>
          <h2 className="section-title">Our Modern Clinic</h2>
          <p className="section-subtitle mx-auto max-w-xl">
            Designed around your comfort — a clean, calm, and hygienic environment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Reception & Waiting Area', src: imgReceptionWaiting },
            { label: 'Digital X-Ray Suite',      src: imgXray },
            { label: 'Sterilisation Room',       src: imgSterilisation },
            { label: 'Treatment Chair 1',        src: imgChairOne },
            { label: 'Treatment Chair 2',        src: imgChairTwo },
            { label: 'Consultation Room',        src: imgConsultation },
          ].map(({ label, src }, i) => (
            <motion.div
              key={label}
              {...fadeUp(i * 0.07)}
              className="relative rounded-2xl aspect-video overflow-hidden flex items-end p-4 group"
              aria-label={label}
            >
              <img
                src={src}
                alt={label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-slate-900/10 to-transparent" aria-hidden="true" />
              <span className="relative z-10 text-xs font-semibold text-slate-700 bg-white/70 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default About;
