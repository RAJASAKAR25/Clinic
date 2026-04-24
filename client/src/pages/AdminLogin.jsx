import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Smile, Lock, User, Eye, EyeOff } from 'lucide-react';
import { adminLogin } from '../services/api.js';
import toast from 'react-hot-toast';
import clinicLogo from '../../assets/Clinic_Logo.svg';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await adminLogin(data);
      localStorage.setItem('adminToken', res.data.token);
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Server unavailable. Please ensure backend is running on port 5000.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-1 rounded-2xl mb-4">
            <img
                src={clinicLogo}
                alt="Sekhar's Dental Clinic logo"
                className="w-9 h-9 object-contain transition-transform duration-200 group-hover:scale-110"
              />
          </div>
          <h1 className="text-xl font-bold text-slate-800 font-heading">Admin Portal</h1>
          <p className="text-sm text-slate-400 mt-1">Sekhar's Dental Clinic</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Admin login form">
          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="form-label">
              <User className="w-3.5 h-3.5 inline mr-1.5" aria-hidden="true" />
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="admin"
              className={`input-field ${errors.username ? 'input-field-error' : ''}`}
              aria-required="true"
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && <p className="form-error" role="alert">{errors.username.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="form-label">
              <Lock className="w-3.5 h-3.5 inline mr-1.5" aria-hidden="true" />
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`input-field pr-10 ${errors.password ? 'input-field-error' : ''}`}
                aria-required="true"
                {...register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="form-error" role="alert">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
                Logging in…
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" aria-hidden="true" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          This area is restricted to authorised personnel only.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
