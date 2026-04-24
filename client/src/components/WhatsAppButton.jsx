import { motion } from 'framer-motion';
import { CLINIC } from '../utils/constants.js';

/**
 * Floating WhatsApp Chat button — fixed bottom-right on all pages.
 */
const WhatsAppButton = () => {
  const whatsappUrl = `https://wa.me/${CLINIC.whatsapp}?text=${CLINIC.whatsappMsg}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 group flex items-center justify-end">
      {/* Label — appears to the left on hover */}
      <span
        className="mr-3 text-sm font-semibold whitespace-nowrap text-white
                   bg-green-500 rounded-full px-4 py-2 shadow-lg
                   opacity-0 translate-x-2 pointer-events-none
                   group-hover:opacity-100 group-hover:translate-x-0
                   transition-all duration-300"
      >
        Chat on WhatsApp
      </span>

      {/* Perfect circle button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="w-14 h-14 flex items-center justify-center flex-shrink-0
                   bg-green-500 hover:bg-green-600 text-white
                   rounded-full shadow-xl hover:shadow-2xl
                   transition-colors duration-200"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 300 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="currentColor"
          className="w-7 h-7"
          aria-hidden="true"
        >
          <path d="M16 2C8.27 2 2 8.27 2 16c0 2.44.66 4.73 1.8 6.72L2 30l7.5-1.76A13.93 13.93 0 0016 30c7.73 0 14-6.27 14-14S23.73 2 16 2zm0 25.5a11.46 11.46 0 01-5.83-1.59l-.42-.25-4.46 1.05 1.06-4.33-.28-.45A11.5 11.5 0 1116 27.5zm6.32-8.66c-.35-.17-2.06-1.01-2.38-1.13s-.55-.17-.78.17-.9 1.13-1.1 1.37-.4.26-.75.08a9.38 9.38 0 01-2.76-1.7 10.3 10.3 0 01-1.91-2.38c-.2-.35 0-.54.15-.7s.35-.4.52-.6.23-.35.35-.58.06-.44-.03-.61-.78-1.88-1.07-2.57c-.28-.68-.57-.59-.78-.6l-.66-.01c-.23 0-.61.09-.93.43s-1.22 1.2-1.22 2.91 1.25 3.38 1.42 3.61 2.46 3.75 5.96 5.26a20 20 0 001.99.73c.84.27 1.6.23 2.2.14.67-.1 2.06-.84 2.35-1.66s.3-1.52.21-1.66-.32-.23-.67-.4z" />
        </svg>
      </motion.a>
    </div>
  );
};

export default WhatsAppButton;
