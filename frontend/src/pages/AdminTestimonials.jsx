import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, LayoutDashboard, X, MessageSquare, Star, MapPin, Quote } from 'lucide-react';
import toast from 'react-hot-toast';
import { createAdminTestimonial, getAdminTestimonials, getAdminTestimonialById, updateAdminTestimonial, deleteAdminTestimonial } from '../services/api.js';

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`w-3.5 h-3.5 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'}`}
      />
    ))}
  </div>
);

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
  'bg-orange-100 text-orange-700',
  'bg-indigo-100 text-indigo-700',
];

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', text: '', location: '', rating: 5 });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await getAdminTestimonials();
      setTestimonials(response.data?.data || []);
    } catch {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const openNew = () => {
    setFormData({ name: '', text: '', location: '', rating: 5 });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = async (id) => {
    try {
      const response = await getAdminTestimonialById(id);
      setFormData(response.data?.data || {});
      setEditingId(id);
      setShowForm(true);
    } catch {
      toast.error('Failed to load testimonial');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateAdminTestimonial(editingId, formData);
        toast.success('Testimonial updated successfully');
      } else {
        await createAdminTestimonial(formData);
        toast.success('Testimonial created successfully');
      }
      setFormData({ name: '', text: '', location: '', rating: 5 });
      setEditingId(null);
      setShowForm(false);
      fetchTestimonials();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial permanently?')) return;
    try {
      await deleteAdminTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      toast.success('Testimonial deleted');
    } catch {
      toast.error('Failed to delete testimonial');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400 font-medium">Super Admin</p>
            <h1 className="text-xl font-bold text-slate-800">Testimonials Management</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/dashboard" className="btn-secondary !px-4 !py-2 text-xs">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <button onClick={openNew} className="btn-primary !px-4 !py-2 text-xs">
              <Plus className="w-4 h-4" />
              New Testimonial
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        {/* Stats bar */}
        <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          <span><strong className="text-slate-700">{testimonials.length}</strong> testimonial{testimonials.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-card p-16 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading testimonials…
          </div>
        ) : testimonials.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-20 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-200" />
            <p className="font-medium text-slate-500">No testimonials yet</p>
            <p className="text-sm mt-1">Click "New Testimonial" to add your first one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t, index) => {
              const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];
              return (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200"
                >
                  {/* Top row: avatar + name + actions */}
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${colorClass}`}>
                      {t.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm leading-tight truncate">{t.name}</p>
                      {t.location && (
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{t.location}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(t.id)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Star rating */}
                  <StarRating rating={t.rating} />

                  {/* Testimonial text */}
                  <div className="relative">
                    <Quote className="w-4 h-4 text-blue-100 absolute -top-1 -left-0.5" />
                    <p className="text-xs text-slate-600 leading-relaxed pl-4 line-clamp-4">{t.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800 text-lg">
                {editingId ? 'Edit Testimonial' : 'New Testimonial'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="form-label">Patient Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Priya Sharma"
                  required
                />
              </div>

              <div>
                <label className="form-label">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Lucknow, UP"
                  required
                />
              </div>

              <div>
                <label className="form-label">Rating</label>
                <div className="flex gap-3 mt-1">
                  {[5, 4, 3, 2, 1].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: r })}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                        formData.rating === r
                          ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                          : 'border-slate-200 bg-white text-slate-400 hover:border-yellow-300'
                      }`}
                    >
                      {r}★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">Testimonial</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="input-field resize-none"
                  rows="4"
                  placeholder="Patient's experience…"
                  required
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1 justify-center !py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 justify-center !py-2.5"
                >
                  {submitting ? 'Saving…' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
