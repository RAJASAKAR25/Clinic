import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { getFaqs } from '../services/api.js';

/**
 * Accessible accordion FAQ section — data loaded live from MongoDB.
 */
const FAQSection = () => {
  const [openId, setOpenId] = useState(null);
  const [faqs,   setFaqs]   = useState([]);

  useEffect(() => {
    getFaqs()
      .then((res) => setFaqs(res.data?.data || []))
      .catch(() => {}); // silently fail — section just stays empty
  }, []);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  if (!faqs.length) return null;

  return (
    <section className="py-20 bg-white" aria-label="Frequently asked questions">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-2">
            FAQ
          </p>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle mx-auto mt-3">
            Got a question? We have the answers. Reach us anytime for more help.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl border transition-colors duration-200 ${
                  isOpen ? 'border-blue-200 bg-blue-50' : 'border-slate-100 bg-white hover:border-blue-100'
                }`}
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  id={`faq-question-${faq.id}`}
                >
                  <span className={`text-sm font-semibold leading-snug ${isOpen ? 'text-blue-700' : 'text-slate-800'}`}>
                    {faq.question}
                  </span>
                  <div
                    className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
                      isOpen ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                    aria-hidden="true"
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      role="region"
                      aria-labelledby={`faq-question-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
