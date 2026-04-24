import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, LayoutDashboard, X, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { createAdminFaq, getAdminFaqs, getAdminFaqById, updateAdminFaq, deleteAdminFaq } from '../services/api.js';

const AdminFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [formData, setFormData] = useState({ question: '', answer: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const response = await getAdminFaqs();
      setFaqs(response.data?.data || []);
    } catch {
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFaqs(); }, []);

  const openNew = () => {
    setFormData({ question: '', answer: '' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = async (id) => {
    try {
      const response = await getAdminFaqById(id);
      setFormData(response.data?.data || {});
      setEditingId(id);
      setShowForm(true);
    } catch {
      toast.error('Failed to load FAQ');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateAdminFaq(editingId, formData);
        toast.success('FAQ updated successfully');
      } else {
        await createAdminFaq(formData);
        toast.success('FAQ created successfully');
      }
      setFormData({ question: '', answer: '' });
      setEditingId(null);
      setShowForm(false);
      fetchFaqs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save FAQ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ permanently?')) return;
    try {
      await deleteAdminFaq(id);
      setFaqs((prev) => prev.filter((faq) => faq.id !== id));
      toast.success('FAQ deleted');
    } catch {
      toast.error('Failed to delete FAQ');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400 font-medium">Super Admin</p>
            <h1 className="text-xl font-bold text-slate-800">FAQs Management</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/dashboard" className="btn-secondary !px-4 !py-2 text-xs">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <button onClick={openNew} className="btn-primary !px-4 !py-2 text-xs">
              <Plus className="w-4 h-4" />
              New FAQ
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* Stats bar */}
        <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <HelpCircle className="w-4 h-4 text-blue-500" />
          <span><strong className="text-slate-700">{faqs.length}</strong> FAQ{faqs.length !== 1 ? 's' : ''} total</span>
        </div>

        {/* FAQ list */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-card p-16 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading FAQs…
          </div>
        ) : faqs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-20 text-center text-slate-400">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 text-slate-200" />
            <p className="font-medium text-slate-500">No FAQs yet</p>
            <p className="text-sm mt-1">Click "New FAQ" to add your first one.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden transition-all duration-200"
              >
                {/* Row header */}
                <div className="flex items-start gap-4 px-5 py-4">
                  {/* Badge */}
                  <span className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>

                  {/* Question */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm leading-snug">{faq.question}</p>
                    {expandedId === faq.id && (
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.answer}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(faq.id)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                      className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
                      title="Toggle answer"
                    >
                      {expandedId === faq.id
                        ? <ChevronUp className="w-4 h-4" />
                        : <ChevronDown className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal Overlay ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800 text-lg">
                {editingId ? 'Edit FAQ' : 'New FAQ'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="form-label">Question</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="input-field resize-none"
                  rows="3"
                  placeholder="Enter the question…"
                  required
                />
              </div>
              <div>
                <label className="form-label">Answer</label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="input-field resize-none"
                  rows="5"
                  placeholder="Enter the answer…"
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
                  {submitting ? 'Saving…' : editingId ? 'Update FAQ' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFAQs;
