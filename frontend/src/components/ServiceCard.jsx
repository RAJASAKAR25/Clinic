import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles, ShieldCheck, Award, Layers, Scissors, Star,
} from 'lucide-react';

// Map icon name string → Lucide component
const ICON_MAP = {
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  Scissors,
  Star,
};

// Colour theme for each card (keyed by service slug)
const THEMES = {
  'teeth-cleaning':       { bg: 'bg-sky-50',    iconBg: 'bg-sky-100',    iconColor: 'text-sky-700',    badge: 'bg-sky-700' },
  'root-canal-treatment': { bg: 'bg-emerald-50',iconBg: 'bg-emerald-100',iconColor: 'text-emerald-700',badge: 'bg-emerald-600' },
  'dental-implants':      { bg: 'bg-cyan-50',   iconBg: 'bg-cyan-100',   iconColor: 'text-cyan-700',   badge: 'bg-cyan-700' },
  'teeth-whitening':      { bg: 'bg-amber-50',  iconBg: 'bg-amber-100',  iconColor: 'text-amber-700',  badge: 'bg-amber-500' },
  'braces-orthodontics':  { bg: 'bg-blue-50',   iconBg: 'bg-blue-100',   iconColor: 'text-blue-700',   badge: 'bg-blue-600' },
  'tooth-extraction':     { bg: 'bg-orange-50', iconBg: 'bg-orange-100', iconColor: 'text-orange-600', badge: 'bg-orange-500' },
};

const DEFAULT_THEME = { bg: 'bg-sky-50', iconBg: 'bg-sky-100', iconColor: 'text-sky-700', badge: 'bg-sky-700' };

/**
 * ServiceCard
 * @param {Object} service  - service object from API / constants
 * @param {number} index    - for staggered animation delay
 * @param {boolean} detailed - show price + benefits (used on Services page)
 */
const ServiceCard = ({ service, index = 0, detailed = false }) => {
  const theme    = THEMES[service.slug] || DEFAULT_THEME;
  const IconComp = ICON_MAP[service.icon] || Sparkles;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`group relative rounded-3xl ${theme.bg} border border-sky-100
                  hover:shadow-medical transition-all duration-300 overflow-hidden
                  flex flex-col`}
    >
      {/* Decorative gradient dot */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 rounded-full ${theme.badge} opacity-5 -translate-y-6 translate-x-6`}
      />

      <div className="p-6 flex flex-col flex-1">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-12 h-12 ${theme.iconBg} rounded-xl mb-4`}>
          <IconComp className={`w-6 h-6 ${theme.iconColor}`} aria-hidden="true" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-800 mb-2 font-heading">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 leading-relaxed flex-1">
          {service.description}
        </p>

        {/* Detailed info (Services page only) */}
        {detailed && (
          <div className="mt-4 space-y-3">
            {service.benefits && (
              <ul className="space-y-1.5">
                {service.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className={`w-1.5 h-1.5 rounded-full ${theme.badge} shrink-0`} />
                    {b}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <span className="text-xs text-slate-400">Duration</span>
                <p className="text-xs font-semibold text-slate-700">{service.duration}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Price</span>
                <p className="text-xs font-bold text-blue-700">{service.price}</p>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-5">
          <Link
            to="/book-appointment"
            className={`inline-flex items-center text-sm font-semibold ${theme.iconColor}
                        hover:underline transition-colors group-hover:gap-2 gap-1`}
          >
            Book Now
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default ServiceCard;
