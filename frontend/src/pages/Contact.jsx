import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import SEOMeta              from '../components/SEOMeta.jsx';
import useFormSubmit        from '../hooks/useFormSubmit.js';
import { sendContactMessage } from '../services/api.js';
import { CLINIC } from '../utils/constants.js';

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 25 },
  whileInView:{ opacity: 1, y: 0 },
  viewport:   { once: true },
  transition: { duration: 0.55, delay },
});

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { isLoading, isSuccess, handleSubmit: submit } = useFormSubmit(sendContactMessage);

  const onSubmit = (data) => submit(data, reset);

  return (
    <>
      <SEOMeta
        title="Contact Us"
        description="Contact Shekar's Dental Clinic in Markapur, Andhra Pradesh. Call +91 7842299457, email us, or fill the form. Located at Nehru Bazar, opp. Uday Satvision."
        canonical="/contact"
        keywords="contact dental clinic Markapur, dentist phone number Markapur, Shekar dental clinic address, dental clinic Nehru Bazar Markapur"
      />

      {/* Header */}
      <header className="page-header" aria-label="Contact page header">
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="text-sky-200 text-sm font-semibold uppercase tracking-widest mb-2"
          >
            Contact
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-sky-100 mt-3 text-base sm:text-lg"
          >
            We are here to help. Reach us by phone, email, or the form below.
          </motion.p>
        </div>
      </header>

      {/* Main content */}
      <section className="py-16 sm:py-20 bg-sky-50/55" aria-label="Contact information and form">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* ── Contact Info ─────────────────────────────────────────── */}
            <div className="space-y-8">
              <motion.div {...fadeUp()}>
                <h2 className="text-2xl font-bold text-slate-800 font-heading mb-6">Clinic Information</h2>

                <div className="space-y-4">
                  {[
                    {
                      Icon: MapPin,
                      label: 'Address',
                      value: CLINIC.address,
                      href: CLINIC.mapLink,
                      linkLabel: 'Get Directions',
                    },
                    {
                      Icon: Phone,
                      label: 'Phone',
                      value: CLINIC.phone,
                      href: `tel:${CLINIC.phone}`,
                    },
                    {
                      Icon: Mail,
                      label: 'Email',
                      value: CLINIC.email,
                      href: `mailto:${CLINIC.email}`,
                    },
                    {
                      Icon: Clock,
                      label: 'Working Hours',
                      value: `${CLINIC.hours.weekdays}\n${CLINIC.hours.sunday}`,
                      href: null,
                    },
                  ].map(({ Icon, label, value, href, linkLabel }) => (
                    <div key={label} className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-card border border-sky-100">
                      <div className="p-2.5 bg-sky-50 rounded-xl shrink-0">
                        <Icon className="w-5 h-5 text-sky-700" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-0.5">{label}</p>
                        {value.includes('\n') ? (
                          value.split('\n').map((line) => (
                            <p key={line} className="text-sm font-semibold text-slate-800 leading-relaxed">{line}</p>
                          ))
                        ) : href ? (
                          <a href={href} className="text-sm font-semibold text-slate-800 hover:text-sky-700 transition-colors">
                            {value}
                          </a>
                        ) : (
                          <p className="text-sm font-semibold text-slate-800">{value}</p>
                        )}
                        {linkLabel && href && (
                          <a href={href} target="_blank" rel="noopener noreferrer"
                             className="text-xs text-sky-600 hover:underline mt-0.5 inline-block">
                            {linkLabel} →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Map */}
              <motion.div {...fadeUp(0.15)} className="rounded-3xl overflow-hidden shadow-card h-60 border border-sky-100 relative">
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
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sekhar's Dental Clinic on Google Maps"
                  className="pointer-events-none"
                />
              </motion.div>
            </div>

            {/* ── Contact Form ─────────────────────────────────────────── */}
            <motion.div {...fadeUp(0.15)}>
              {isSuccess ? (
                <div className="bg-white rounded-3xl shadow-medical border border-sky-100 p-10 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-9 h-9 text-green-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 font-heading mb-2">Message Sent!</h3>
                  <p className="text-slate-500 text-sm">
                    Thank you for reaching out. We will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl shadow-medical border border-sky-100 p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-slate-800 font-heading mb-6">Send Us a Message</h2>

                  <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Contact form" className="space-y-5">

                    {/* Name */}
                    <div>
                      <label htmlFor="contact-name" className="form-label">
                        Full Name <span className="text-red-500" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="Your name"
                        autoComplete="name"
                        className={`input-field ${errors.name ? 'input-field-error' : ''}`}
                        {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
                      />
                      {errors.name && <p className="form-error" role="alert">{errors.name.message}</p>}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      {/* Email */}
                      <div>
                        <label htmlFor="contact-email" className="form-label">
                          Email <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          className={`input-field ${errors.email ? 'input-field-error' : ''}`}
                          {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                          })}
                        />
                        {errors.email && <p className="form-error" role="alert">{errors.email.message}</p>}
                      </div>

                      {/* Phone */}
                      <div>
                        <label htmlFor="contact-phone" className="form-label">Phone</label>
                        <input
                          id="contact-phone"
                          type="tel"
                          placeholder="Mobile number (optional)"
                          autoComplete="tel"
                          className={`input-field ${errors.phone ? 'input-field-error' : ''}`}
                          {...register('phone', {
                            pattern: { value: /^[6-9]\d{9}$/, message: '10-digit Indian mobile number' },
                          })}
                        />
                        {errors.phone && <p className="form-error" role="alert">{errors.phone.message}</p>}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="contact-subject" className="form-label">Subject</label>
                      <input
                        id="contact-subject"
                        type="text"
                        placeholder="What is this regarding?"
                        className="input-field"
                        {...register('subject')}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="contact-message" className="form-label">
                        Message <span className="text-red-500" aria-hidden="true">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        placeholder="Tell us how we can help you…"
                        className={`input-field resize-none ${errors.message ? 'input-field-error' : ''}`}
                        {...register('message', {
                          required: 'Message is required',
                          minLength: { value: 10, message: 'Please write at least 10 characters' },
                          maxLength: { value: 1000, message: 'Message must be under 1000 characters' },
                        })}
                      />
                      {errors.message && <p className="form-error" role="alert">{errors.message.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                      aria-busy={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" aria-hidden="true" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
