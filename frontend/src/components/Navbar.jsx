import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { CLINIC, NAV_LINKS } from '../utils/constants.js';
import clinicLogo from '../../assets/Clinic_Logo.svg';

const Navbar = () => {
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const activeClass   = 'text-sky-800 bg-white shadow-sm';
  const inactiveClass = 'text-slate-600 hover:text-sky-700 hover:bg-white';

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white/85 backdrop-blur-md py-4'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 group">
            <img
              src={clinicLogo}
              alt="Sekhar's Dental Clinic logo"
              className="w-9 h-9 object-contain transition-transform duration-200 group-hover:scale-110 float-soft"
            />
            <div className="leading-tight">
              <span className="block text-sm font-bold text-blue-700">Sekhar's</span>
              <span className="block text-xs text-slate-400 font-medium">Dental Clinic</span>
            </div>
          </Link>

          {/* ── Desktop Navigation ───────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full p-1" role="navigation" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
                    isActive ? activeClass : inactiveClass
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* ── Desktop CTAs ─────────────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${CLINIC.phone}`}
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium"
              aria-label={`Call ${CLINIC.phone}`}
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              <span>{CLINIC.phone}</span>
            </a>
            <Link to="/book-appointment" className="btn-primary py-2.5 px-5 text-sm">
              Book Appointment
            </Link>
          </div>

          {/* ── Mobile: call button + hamburger ─────────────────────────── */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={`tel:${CLINIC.phone}`}
              className="p-2 bg-sky-700 rounded-xl text-white hover:bg-sky-800 transition-colors"
              aria-label="Call us now"
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
            </a>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Dropdown Menu ──────────────────────────────────────── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pt-4 pb-3 border-t border-slate-100 mt-3 space-y-1">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={link.path === '/'}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? activeClass : inactiveClass
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <div className="pt-2">
                  <Link
                    to="/book-appointment"
                    onClick={closeMenu}
                    className="btn-primary w-full justify-center py-3 text-sm"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Navbar;
