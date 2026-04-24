import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { getTestimonials } from '../services/api.js';

const AUTO_ADVANCE_MS = 5000;

const AVATAR_COLORS = [
  'bg-rose-100 text-rose-700',
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-indigo-100 text-indigo-700',
];

const TestimonialSlider = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [active,     setActive]     = useState(0);
  const [paused,     setPaused]     = useState(false);
  const [direction,  setDirection]  = useState(1); // 1 = forward, -1 = back

  // Load from MongoDB on mount
  useEffect(() => {
    getTestimonials()
      .then((res) => setTestimonials(res.data?.data || []))
      .catch(() => {});
  }, []);

  const total = testimonials.length;

  const goTo = useCallback(
    (idx, dir = 1) => {
      if (!total) return;
      setDirection(dir);
      setActive((idx + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(active + 1, 1),  [active, goTo]);
  const prev = useCallback(() => goTo(active - 1, -1), [active, goTo]);

  // Auto-advance
  useEffect(() => {
    if (paused || !total) return;
    const timer = setInterval(next, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [active, paused, next, total]);

  const variants = {
    enter:  (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  if (!total) return null;

  const t = testimonials[active];
  const initials = t.name?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '??';
  const color = AVATAR_COLORS[active % AVATAR_COLORS.length];

  return (
    <section
      className="py-20 overflow-hidden"
      aria-label="Patient testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        background:
          'radial-gradient(circle at 10% 10%, rgba(255,255,255,0.24), transparent 30%), linear-gradient(130deg, #114b70 0%, #1c6ea1 58%, #2187c8 100%)',
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sky-200 text-sm font-semibold uppercase tracking-widest mb-2">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-heading mb-12">
            What Our Patients Say
          </h2>
        </motion.div>

        {/* Card */}
        <div className="relative min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={t.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              {/* Quote */}
              <div className="bg-white/14 backdrop-blur-sm rounded-3xl p-8 mx-4 max-w-2xl border border-white/20">
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" aria-hidden="true" />
                  ))}
                </div>

                {/* Text */}
                <blockquote className="text-white/90 text-base md:text-lg leading-relaxed italic mb-6">
                  &ldquo;{t.text}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-sm font-bold flex-shrink-0`}
                    aria-hidden="true"
                  >
                    {initials}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-sky-200 text-xs">{t.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            onClick={prev}
            className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > active ? 1 : -1)}
                role="tab"
                aria-selected={i === active}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === active
                    ? 'bg-white w-6 h-2.5'
                    : 'bg-white/40 w-2.5 h-2.5 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
