import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SEOMeta        from '../components/SEOMeta.jsx';
import ServiceCard    from '../components/ServiceCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getServices } from '../services/api.js';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data.data || []))
      .catch(() => setError('Failed to load services. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEOMeta
        title="Our Services"
        description="Explore all dental services at Shekar's Dental Clinic, Markapur — teeth cleaning, root canal, dental implants, crowns, braces, whitening & more. Affordable care in Andhra Pradesh."
        canonical="/services"
        keywords="dental services Markapur, root canal treatment, dental implants Markapur, teeth whitening, crowns and bridges, braces Markapur, teeth cleaning Andhra Pradesh, dental checkup"
      />

      {/* Page header */}
      <header className="page-header" aria-label="Services page header">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-20 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 left-10 w-44 h-44 bg-sky-300/20 rounded-full blur-2xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-sky-200 text-sm font-semibold uppercase tracking-widest mb-3"
          >
            Services
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading"
          >
            Dental Services We Offer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="text-sky-100 mt-4 text-base sm:text-lg max-w-xl mx-auto"
          >
            From preventive checkups to advanced restorative procedures, designed for comfort and long-term oral health.
          </motion.p>
        </div>
      </header>

      <section className="py-12 bg-white" aria-label="Service categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: 'Preventive Dentistry',
                copy: 'Routine cleanings, checkups, and early diagnosis to prevent major dental issues.',
              },
              {
                title: 'Restorative Dentistry',
                copy: 'Root canals, crowns, and tooth restorations using modern, pain-managed techniques.',
              },
              {
                title: 'Cosmetic & Smile Care',
                copy: 'Whitening and smile improvement plans tailored to your goals and dental profile.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-sky-100 bg-sky-50/50 p-5">
                <h3 className="text-base font-bold text-slate-800">{item.title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 sm:py-20 bg-sky-50/55" aria-label="All services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && <LoadingSpinner message="Loading services…" />}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {services.map((svc, i) => (
                <ServiceCard key={svc.id} service={svc} index={i} detailed />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 text-center"
        aria-label="CTA"
        style={{
          background: 'linear-gradient(135deg, #114b70 0%, #1f7db8 100%)',
        }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sky-100 mb-6 text-sm sm:text-base leading-relaxed">
              Looking for reliable and advanced dental treatment in Markapuram? Visit Sekhar’s Dental Clinic for
quality care and a comfortable experience.
            </p>
            <a href="/book-appointment" className="btn-white">
              Book Your Appointment
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Services;
