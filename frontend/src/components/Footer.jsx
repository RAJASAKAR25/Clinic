import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import { CLINIC, NAV_LINKS, SERVICE_LIST } from '../utils/constants.js';
import config from '../config.js';
import clinicLogo from '../../assets/Clinic_Logo.svg';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="text-slate-200"
      aria-label="Site footer"
      style={{ background: 'linear-gradient(140deg, #103f5e 0%, #145a84 55%, #1f7db8 100%)' }}
    >
      {/* ── Main footer grid ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <img
                src={clinicLogo}
                alt="Sekhar's Dental Clinic logo"
                className="w-9 h-9 object-contain transition-transform duration-200 group-hover:scale-110"
              />
              <div className="leading-tight">
                <span className="block text-sm font-bold text-white">Sekhar's</span>
                <span className="block text-xs text-slate-400 font-medium">Dental Clinic</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-sky-100/85 mb-5">
              Expert dental care by Dr. RajaSakar in Markapur, Andhra Pradesh. Your smile is our top priority.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Facebook,  href: config.social.facebook, label: 'Facebook' },
                { Icon: Instagram, href: config.social.instagram, label: 'Instagram' },
              ].filter(item => !!item.href).map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 bg-white/15 hover:bg-white/25 rounded-lg text-sky-100 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[...NAV_LINKS, { label: 'Book Appointment', path: '/book-appointment' }].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-sky-100/85 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">
              Our Services
            </h3>
            <ul className="space-y-2.5">
              {SERVICE_LIST.slice(0, 6).map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-sm text-sky-100/85 hover:text-white transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sky-200 mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-sm text-sky-100/85 leading-relaxed">{CLINIC.address}</span>
              </li>
              <li>
                <a
                  href={`tel:${CLINIC.phone}`}
                  className="flex items-center gap-3 text-sm text-sky-100/85 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-sky-200 shrink-0" aria-hidden="true" />
                  {CLINIC.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CLINIC.email}`}
                  className="flex items-center gap-3 text-sm text-sky-100/85 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-sky-200 shrink-0" aria-hidden="true" />
                  {CLINIC.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-sky-200 mt-0.5 shrink-0" aria-hidden="true" />
                <div className="text-sm text-sky-100/85 space-y-0.5">
                  <p>{CLINIC.hours.weekdays}</p>
                  <p>{CLINIC.hours.sunday}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Copyright bar ──────────────────────────────────────────────── */}
      <div className="border-t border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sky-200/80">
          <p>© {year} Sekhar's Dental Clinic. All rights reserved.</p>
          <p>
            Designed for{' '}
            <span className="text-amber-300 font-medium">Dr. RajaSakar</span>
            {' '}— Markapur, Andhra Pradesh
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
