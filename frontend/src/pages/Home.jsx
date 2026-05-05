import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone, MapPin, Clock, ChevronRight, Shield, Smile,
  Star, CheckCircle2, Calendar,
} from 'lucide-react';
import SEOMeta from '../components/SEOMeta.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import TestimonialSlider from '../components/TestimonialSlider.jsx';
import FAQSection from '../components/FAQSection.jsx';
import DoctorCard from '../components/DoctorCard.jsx';
import VisitingSpecialists from '../components/VisitingSpecialists.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getServices } from '../services/api.js';
import { CLINIC, STATS } from '../utils/constants.js';

import imgReception from '../../assets/Clinic_Reception_Area.webp';
import imgTreatment from '../../assets/Clinic_Treatment_Room_Chair_One.webp';
import imgXray from '../../assets/Clinic_Dental_X-ray.webp';
import imgSterilisation from '../../assets/Clinic_Sterilisation_Unit.webp';
import imgWaiting from '../../assets/Clinic_Waiting_Lounge.webp';
import imgConsultation from '../../assets/Clinic_Consultation_Room.webp';

/* ── Fade-up animation preset ─────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

/* ── Hero Section ─────────────────────────────────────────────────────────── */
const Hero = () => (
  <section
    className="relative min-h-screen
               flex items-center overflow-hidden"
    aria-label="Hero"
    style={{
      background:
        'radial-gradient(circle at 10% 8%, rgba(255,255,255,0.24), transparent 35%), linear-gradient(120deg, #114b70 0%, #1a6da2 55%, #2387c7 100%)',
    }}
  >
    {/* Decorative blobs */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl float-soft" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl float-soft" style={{ animationDelay: '1.2s' }} />
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
      {/* ── Left content ──────────────────────────────────────────────── */}
      <div>
        {/* Badge */}
        <motion.a
          href="https://share.google/wGkVhK3n6QIp5qT39"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white
                     px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20 hover:bg-white/20 transition-colors"
        >
          <MapPin className="w-4 h-4 text-blue-200" aria-hidden="true" />
          Now Open in Nehru Bazar, Markapur, Andhra Pradesh
        </motion.a>

        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.27 }}
          className="flex flex-wrap gap-2.5 mb-4"
        >
          {['16+ Years Experience', 'Certified Sterile Protocols', 'Family-Friendly Care'].map((pill) => (
            <span key={pill} className="inline-flex items-center rounded-full bg-white/15 border border-white/25 px-3.5 py-1.5 text-xs font-semibold text-white/95">
              {pill}
            </span>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white font-heading leading-tight"
        >
          Your Smile is{' '}
          <span className="text-amber-300">Our Priority</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="mt-5 text-sky-100 text-base sm:text-lg leading-relaxed max-w-xl"
        >
          Expert dental care by <strong className="text-white">Dr. RajaSakar</strong> at Nehru Bazar,
          Markapur. Calm consultations, modern dental technology, and transparent treatment planning
          for children, adults, and seniors.
        </motion.p>

        {/* Trust bullets */}
        <motion.ul
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          className="mt-5 space-y-2"
          aria-label="Key benefits"
        >
          {['Painless modern treatments', 'Advanced sterilised equipment', 'Care plans designed for long-term dental health'].map((item) => (
            <li key={item} className="flex items-center gap-2 text-blue-100 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </motion.ul>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <Link to="/book-appointment" className="btn-white shadow-lg">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            Book Appointment
          </Link>
          <Link to="/services" className="btn-outline-white">
            Our Services
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Quick contact */}
        <motion.a
          href={`tel:${CLINIC.phone}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
          className="mt-6 inline-flex flex-wrap items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors"
        >
          <Phone className="w-4 h-4" aria-hidden="true" />
          {CLINIC.phone}
          <span className="text-blue-300">· {CLINIC.hours.weekdays} · {CLINIC.hours.sunday}</span>
        </motion.a>
      </div>

      {/* ── Right card ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
        className="block max-w-md mx-auto w-full lg:max-w-none float-soft"
        style={{ animationDelay: '0.4s' }}
      >
        <DoctorCard compact />
      </motion.div>
    </div>

    {/* Wave divider */}
    <div className="absolute bottom-0 inset-x-0 pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 fill-white">
        <path d="M0,40 C360,0 1080,70 1440,30 L1440,60 L0,60 Z" />
      </svg>
    </div>
  </section>
);

/* ── Stats Strip ──────────────────────────────────────────────────────────── */
const StatsStrip = () => (
  <section className="bg-transparent py-12 relative z-10" aria-label="Key statistics">
    <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          {...fadeUp(i * 0.1)}
          className="text-center rounded-2xl bg-white/90 border border-sky-100 p-5 shadow-card"
        >
          <p className="text-3xl font-bold text-sky-800 font-heading">{stat.number}</p>
          <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

const CareTracks = () => (
  <section className="py-20 bg-white" aria-label="Care tracks">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div {...fadeUp()} className="text-center mb-12">
        <p className="text-sky-700 text-sm font-semibold uppercase tracking-widest mb-2">Our Expertise</p>
        <h2 className="section-title">Specialized Care for Every Age</h2>
        <p className="section-subtitle mx-auto max-w-2xl">
          Thoughtful pediatric guidance and complete adult dentistry, all under one trusted clinic.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-7">
        {[
          {
            title: 'Kids & Teens Dentistry',
            copy: 'Gentle consultations, habit counseling, preventive care, and pain-managed treatments tailored for growing smiles.',
            points: ['Preventive checkups and fluoride', 'Tooth decay and trauma management', 'Early bite and jaw guidance'],
          },
          {
            title: 'Adults & Family Dentistry',
            copy: 'Restorative and cosmetic procedures delivered with clear communication and modern sterile clinical systems.',
            points: ['Root canals and restorations', 'Implants, crowns, and bridges', 'Smile improvement and whitening'],
          },
        ].map((track, idx) => (
          <motion.article
            key={track.title}
            {...fadeUp(idx * 0.1)}
            className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50/80 to-white p-7 shadow-card"
          >
            <h3 className="text-xl font-bold text-slate-800 mb-3">{track.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{track.copy}</p>
            <ul className="space-y-2.5">
              {track.points.map((point) => (
                <li key={point} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-sky-600" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

/* ── Why Choose Us ────────────────────────────────────────────────────────── */
const WhyChooseUs = () => {
  const features = [
    { Icon: Shield, title: 'Safe & Sterile', desc: 'Hospital-grade sterilisation for every procedure. Your safety is our commitment.' },
    { Icon: Smile, title: 'Painless Treatments', desc: 'Modern anaesthesia and advanced techniques ensure a comfortable, stress-free visit.' },
    { Icon: Star, title: 'Expert Doctor', desc: 'Dr. RajaSakar brings 10+ years of clinical expertise to every consultation.' },
    { Icon: Clock, title: 'Convenient Hours', desc: 'Open Monday to Saturday from 9:00 AM to 8:30 PM and Sunday from 9:00 AM to 1:30 PM.' },
  ];

  return (
    <section className="py-20 bg-sky-50/55" aria-label="Why choose Sekhar's Dental Clinic">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <p className="text-sky-700 text-sm font-semibold uppercase tracking-widest mb-2">Why Us</p>
          <h2 className="section-title">The Best in the Business</h2>
          <p className="section-subtitle mx-auto max-w-xl">
            Calm appointments, clear treatment communication, and a modern clinic setup designed around patient comfort.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              {...fadeUp(i * 0.1)}
              className="bg-white p-6 rounded-2xl shadow-card text-center hover:shadow-medical transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-4">
                <Icon className="w-7 h-7 text-blue-600" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── Gallery placeholder ──────────────────────────────────────────────────── */
const GallerySection = () => {
  const tiles = [
    { label: 'Reception Area', src: imgReception },
    { label: 'Treatment Room', src: imgTreatment },
    { label: 'Digital X-Ray', src: imgXray },
    { label: 'Sterilisation Unit', src: imgSterilisation },
    { label: 'Waiting Lounge', src: imgWaiting },
    { label: 'Consultation Room', src: imgConsultation },
  ];

  return (
    <section className="py-20 bg-white" aria-label="Clinic gallery">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-2">Gallery</p>
          <h2 className="section-title">A Look Inside Our Clinic</h2>
          <p className="section-subtitle mx-auto max-w-xl">
            A modern, hygienic, and welcoming environment designed for your comfort.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tiles.map(({ label, src }, i) => (
            <motion.div
              key={label}
              {...fadeUp(i * 0.07)}
              className="rounded-2xl aspect-video flex items-end p-4 overflow-hidden relative group"
              aria-label={label}
            >
              <img
                src={src}
                alt={label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-slate-900/10 to-transparent" aria-hidden="true" />
              <div className="relative z-10 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <span className="text-xs font-semibold text-slate-700">{label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── CTA Banner ───────────────────────────────────────────────────────────── */
const CTABanner = () => (
  <section
    className="py-20 bg-gradient-to-r from-blue-700 to-blue-500"
    aria-label="Call to action"
  >
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.div {...fadeUp()}>
        <h2 className="text-3xl md:text-4xl font-bold text-white font-heading mb-4">
          Ready for a Healthier Smile?
        </h2>
        <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
          Book your appointment today and experience compassionate dental care in our
          clinic at Nehru Bazar, Markapur.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/book-appointment" className="btn-white">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            Book Appointment
          </Link>
          <a href={`tel:${CLINIC.phone}`} className="btn-outline-white">
            <Phone className="w-4 h-4" aria-hidden="true" />
            Call Us Now
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ── Map + Contact Strip ──────────────────────────────────────────────────── */
const MapContact = () => (
  <section className="py-20 bg-slate-50" aria-label="Location and contact">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div {...fadeUp()} className="text-center mb-12">
        <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-2">Find Us</p>
        <h2 className="section-title">Visit Us in Markapur</h2>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Map */}
        <motion.div {...fadeUp(0.1)} className="lg:col-span-2 rounded-2xl overflow-hidden shadow-card h-72 lg:h-auto relative group">
          <a
            href={CLINIC.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-10"
            aria-label="Open Sekhar's Dental Clinic location in Google Maps"
            title="Open in Google Maps"
          />
          <iframe
            src={CLINIC.mapEmbed}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '280px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Sekhar's Dental Clinic location on Google Maps"
            className="pointer-events-none"
          />
          <div className="absolute top-3 right-3 z-20 bg-white/90 text-slate-700 text-xs px-2.5 py-1 rounded-md shadow-sm">
            Click map to open
          </div>
        </motion.div>

        {/* Contact details */}
        <motion.div {...fadeUp(0.2)} className="space-y-5">
          {[
            { Icon: MapPin, label: 'Address', value: CLINIC.address, href: null },
            { Icon: Phone, label: 'Phone', value: CLINIC.phone, href: `tel:${CLINIC.phone}` },
            { Icon: Clock, label: 'Mon – Sat', value: CLINIC.hours.weekdays.replace(/^.*?:\s*/, ''), href: null },
            { Icon: Clock, label: 'Sunday', value: CLINIC.hours.sunday.replace(/^.*?:\s*/, ''), href: null },
          ].map(({ Icon, label, value, href }) => (
            <div key={label} className="bg-white rounded-xl p-4 shadow-card flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
                <Icon className="w-5 h-5 text-blue-600" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
                {href ? (
                  <a href={href} className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                    {value}
                  </a>
                ) : (
                  <p className="text-sm font-semibold text-slate-800">{value}</p>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

/* ══════════════════════════════════════════════════════════════════════════ */
/*  Home Page                                                                */
/* ══════════════════════════════════════════════════════════════════════════ */
const Home = () => {
  const [services, setServices] = useState([]);
  const [loadingSvc, setLoadingSvc] = useState(true);

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data.data || []))
      .catch(() => setServices([]))
      .finally(() => setLoadingSvc(false));
  }, []);

  return (
    <>
      <SEOMeta
        title="Home"
        description="Shekar's Dental Clinic in Markapur, Andhra Pradesh — expert dental care by Dr. RajaSakar. Book your appointment online today."
        canonical="/"
      />

      <Hero />
      <StatsStrip />

      {/* Services preview */}
      <WhyChooseUs />
      <CareTracks />

      <section className="py-20 bg-white" aria-label="Our dental services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <p className="text-sky-700 text-sm font-semibold uppercase tracking-widest mb-2">Services</p>
            <h2 className="section-title">Comprehensive Dental Care</h2>
            <p className="section-subtitle mx-auto max-w-xl">
              From routine cleaning to complex restorations — everything under one roof.
            </p>
          </motion.div>

          {loadingSvc ? (
            <LoadingSpinner message="Loading services…" />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((svc, i) => (
                <ServiceCard key={svc.id} service={svc} index={i} />
              ))}
            </div>
          )}

          <motion.div {...fadeUp(0.2)} className="text-center mt-10">
            <Link to="/services" className="btn-secondary">
              View All Services <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>

      <VisitingSpecialists />
      <TestimonialSlider />
      <GallerySection />
      <FAQSection />
      <CTABanner />
      <MapContact />
    </>
  );
};

export default Home;
