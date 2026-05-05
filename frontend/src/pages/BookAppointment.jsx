import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, User, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import SEOMeta           from '../components/SEOMeta.jsx';
import LoadingSpinner    from '../components/LoadingSpinner.jsx';
import useFormSubmit     from '../hooks/useFormSubmit.js';
import { bookAppointment, getServices } from '../services/api.js';
import { CLINIC, SERVICE_LIST, SUNDAY_TIME_SLOTS, TIME_SLOTS, WEEKDAY_TIME_SLOTS } from '../utils/constants.js';

const toLocalDateKey = (value = new Date()) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseTimeSlotToMinutes = (slot = '') => {
  const [timePart, period] = String(slot).split(' ');
  if (!timePart || !period) return null;

  const [rawHour, rawMinute] = timePart.split(':');
  const hour = Number(rawHour);
  const minute = Number(rawMinute);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;

  let hours24 = hour % 12;
  if (period.toUpperCase() === 'PM') {
    hours24 += 12;
  }

  return hours24 * 60 + minute;
};

const BookAppointment = () => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const [bookedData, setBookedData] = useState(null);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const selectedDate = watch('date');
  const selectedTime = watch('time');

  const selectedDateValue = selectedDate ? new Date(`${selectedDate}T00:00:00`) : null;
  const isSunday = selectedDateValue ? selectedDateValue.getDay() === 0 : false;
  const isToday = selectedDateValue ? toLocalDateKey(selectedDateValue) === toLocalDateKey(new Date()) : false;
  const baseTimeSlots = selectedDateValue ? (isSunday ? SUNDAY_TIME_SLOTS : WEEKDAY_TIME_SLOTS) : TIME_SLOTS;
  const availableTimeSlots = isToday
    ? baseTimeSlots.filter((slot) => {
      const slotMinutes = parseTimeSlotToMinutes(slot);
      if (slotMinutes === null) return false;
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      return slotMinutes > nowMinutes;
    })
    : baseTimeSlots;

  const { isLoading, isSuccess, handleSubmit: submit } = useFormSubmit(bookAppointment, {
    onSuccess: (data) => setBookedData(data?.data || null),
  });

  useEffect(() => {
    if (selectedTime && !availableTimeSlots.includes(selectedTime)) {
      setValue('time', '');
    }
  }, [availableTimeSlots, selectedTime, setValue]);

  const withOtherOption = (serviceNames = []) => {
    const cleaned = serviceNames.filter(Boolean);
    return cleaned.includes('Other') ? cleaned : [...cleaned, 'Other'];
  };

  useEffect(() => {
    let isMounted = true;

    getServices()
      .then((res) => {
        if (!isMounted) return;

        const serviceTitles = (res.data?.data || [])
          .map((service) => service?.title || service?.name || service?.service)
          .filter(Boolean);

        setServices(withOtherOption(serviceTitles.length ? serviceTitles : SERVICE_LIST));
      })
      .catch(() => {
        if (isMounted) setServices(withOtherOption(SERVICE_LIST));
      })
      .finally(() => {
        if (isMounted) setServicesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const onSubmit = (data) => submit(data, reset);

  const minDate = toLocalDateKey(new Date());

  /* ── Success screen ─────────────────────────────────────────────────────── */
  if (isSuccess && bookedData) {
    return (
      <>
        <SEOMeta title="Appointment Booked" description="Your appointment has been successfully booked at Shekar's Dental Clinic." canonical="/book-appointment" robots="noindex, nofollow" />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-medical p-10 max-w-md w-full text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-9 h-9 text-green-600" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 font-heading mb-2">
              Appointment Booked!
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Thank you, <strong>{bookedData.name}</strong>! We will call you to confirm.
            </p>
            <div className="bg-blue-50 rounded-xl p-4 text-left space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Service</span>
                <span className="font-semibold text-slate-800">{bookedData.service}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Date</span>
                <span className="font-semibold text-slate-800">
                  {new Date(bookedData.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Time</span>
                <span className="font-semibold text-slate-800">{bookedData.time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <span className="badge-pending capitalize">{bookedData.status}</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Questions? Call us at{' '}
              <a href={`tel:${CLINIC.phone}`} className="text-blue-600 font-semibold hover:underline">
                {CLINIC.phone}
              </a>
            </p>
            <Link to="/" className="btn-primary w-full justify-center">
              Back to Home
            </Link>
          </motion.div>
        </div>
      </>
    );
  }

  /* ── Booking form ───────────────────────────────────────────────────────── */
  return (
    <>
      <SEOMeta title="Book Appointment" description="Book a dental appointment online at Shekar's Dental Clinic, Markapur. Choose your preferred date, time, and service. Same-day confirmation." canonical="/book-appointment" keywords="book dental appointment Markapur, dental appointment online, dentist appointment Andhra Pradesh, Shekar dental booking" />

      {/* Header */}
      <header className="page-header" aria-label="Book appointment header">
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading"
          >
            Book an Appointment
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-blue-100 mt-3 text-base sm:text-lg"
          >
            Fill in the form below and we will confirm your slot within a few hours.
          </motion.p>
        </div>
      </header>

      <section className="py-16 bg-slate-50" aria-label="Appointment form">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-medical p-8 md:p-10"
          >
            <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Appointment booking form">
              <div className="grid md:grid-cols-2 gap-6">

                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="form-label">
                    <User className="w-3.5 h-3.5 inline mr-1.5 text-blue-500" aria-hidden="true" />
                    Full Name <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    autoComplete="name"
                    className={`input-field ${errors.name ? 'input-field-error' : ''}`}
                    aria-required="true"
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    {...register('name', {
                      required: 'Full name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    })}
                  />
                  {errors.name && <p id="name-error" className="form-error" role="alert">{errors.name.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="form-label">
                    <Phone className="w-3.5 h-3.5 inline mr-1.5 text-blue-500" aria-hidden="true" />
                    Phone Number <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    autoComplete="tel"
                    className={`input-field ${errors.phone ? 'input-field-error' : ''}`}
                    aria-required="true"
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number' },
                    })}
                  />
                  {errors.phone && <p id="phone-error" className="form-error" role="alert">{errors.phone.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="form-label">
                    <Mail className="w-3.5 h-3.5 inline mr-1.5 text-blue-500" aria-hidden="true" />
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com (optional)"
                    autoComplete="email"
                    className={`input-field ${errors.email ? 'input-field-error' : ''}`}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    {...register('email', {
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                    })}
                  />
                  {errors.email && <p id="email-error" className="form-error" role="alert">{errors.email.message}</p>}
                </div>

                {/* Service */}
                <div>
                  <label htmlFor="service" className="form-label">
                    Service <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="service"
                    className={`input-field ${errors.service ? 'input-field-error' : ''}`}
                    aria-required="true"
                    aria-describedby={errors.service ? 'service-error' : undefined}
                    {...register('service', { required: 'Please select a service' })}
                  >
                    <option value="">{servicesLoading ? 'Loading services…' : '— Select a service —'}</option>
                    {services.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.service && <p id="service-error" className="form-error" role="alert">{errors.service.message}</p>}
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="date" className="form-label">
                    <Calendar className="w-3.5 h-3.5 inline mr-1.5 text-blue-500" aria-hidden="true" />
                    Preferred Date <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="date"
                    type="date"
                    min={minDate}
                    className={`input-field ${errors.date ? 'input-field-error' : ''}`}
                    aria-required="true"
                    aria-describedby={errors.date ? 'date-error' : undefined}
                    {...register('date', { required: 'Please select a date' })}
                  />
                  {errors.date && <p id="date-error" className="form-error" role="alert">{errors.date.message}</p>}
                </div>

                {/* Time */}
                <div>
                  <label htmlFor="time" className="form-label">
                    <Clock className="w-3.5 h-3.5 inline mr-1.5 text-blue-500" aria-hidden="true" />
                    Preferred Time <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="time"
                    className={`input-field ${errors.time ? 'input-field-error' : ''}`}
                    aria-required="true"
                    aria-describedby={errors.time ? 'time-error' : undefined}
                    {...register('time', { required: 'Please select a time slot' })}
                  >
                    <option value="">{selectedDateValue ? '— Select a time —' : 'Choose a date first'}</option>
                    {availableTimeSlots.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.time && <p id="time-error" className="form-error" role="alert">{errors.time.message}</p>}
                </div>

                {/* Message (full width) */}
                <div className="md:col-span-2">
                  <label htmlFor="message" className="form-label">
                    <MessageSquare className="w-3.5 h-3.5 inline mr-1.5 text-blue-500" aria-hidden="true" />
                    Additional Notes
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Any special concerns or information for the doctor…"
                    className={`input-field resize-none ${errors.message ? 'input-field-error' : ''}`}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    {...register('message', {
                      maxLength: { value: 500, message: 'Message must be under 500 characters' },
                    })}
                  />
                  {errors.message && <p id="message-error" className="form-error" role="alert">{errors.message.message}</p>}
                </div>
              </div>

              {/* Submit */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
                      Booking…
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5" aria-hidden="true" />
                      Confirm Appointment
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-400 mt-3">
                  By booking you agree that we may contact you at the number provided to confirm.
                </p>
              </div>
            </form>
          </motion.div>

          {/* Quick contact note */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-center text-sm text-slate-500 mt-6"
          >
            Prefer to call?{' '}
            <a href={`tel:${CLINIC.phone}`} className="text-blue-600 font-semibold hover:underline">
              {CLINIC.phone}
            </a>
            {' '}· {CLINIC.hours.weekdays} · {CLINIC.hours.sunday}
          </motion.p>
        </div>
      </section>
    </>
  );
};

export default BookAppointment;
