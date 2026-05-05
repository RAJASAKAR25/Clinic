import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Smile } from 'lucide-react';
import SEOMeta from '../components/SEOMeta.jsx';

const NotFound = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
    <SEOMeta title="Page Not Found" description="This page does not exist." robots="noindex, nofollow" />
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md"
    >
      {/* 404 number */}
      <div className="text-9xl font-bold text-blue-100 font-heading select-none mb-4" aria-hidden="true">
        404
      </div>

      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-5">
        <Smile className="w-8 h-8 text-blue-600" aria-hidden="true" />
      </div>

      <h1 className="text-2xl font-bold text-slate-800 font-heading mb-2">
        Page Not Found
      </h1>
      <p className="text-slate-500 mb-8 leading-relaxed">
        The page you are looking for does not exist or has been moved.
        Let's get you back on track!
      </p>

      <Link to="/" className="btn-primary">
        <Home className="w-4 h-4" aria-hidden="true" />
        Back to Home
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
