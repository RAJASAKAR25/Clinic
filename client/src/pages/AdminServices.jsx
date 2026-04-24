import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, LayoutDashboard, X, Zap, Clock, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import { createAdminService, getAdminServices, getAdminServiceById, updateAdminService, deleteAdminService } from '../services/api.js';

const ICONS = ['sparkles', 'shield-check', 'award', 'layers', 'scissors', 'zap'];
const COLORS = ['blue', 'green', 'purple', 'pink', 'yellow', 'orange', 'indigo', 'rose', 'cyan', 'red'];

const COLOR_MAP = {
  blue:   'bg-blue-100 text-blue-700',
  green:  'bg-emerald-100 text-emerald-700',
  purple: 'bg-purple-100 text-purple-700',
  pink:   'bg-pink-100 text-pink-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  orange: 'bg-orange-100 text-orange-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  rose:   'bg-rose-100 text-rose-700',
  cyan:   'bg-cyan-100 text-cyan-700',
  red:    'bg-red-100 text-red-700',
};

const EMPTY_FORM = {
  title: '', slug: '', description: '', longDescription: '',
  icon: 'sparkles', color: 'blue', duration: '', price: '', benefits: [],
};

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await getAdminServices();
      setServices(response.data?.data || []);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const openNew = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = async (id) => {
    try {
      const response = await getAdminServiceById(id);
      setFormData(response.data?.data || EMPTY_FORM);
      setEditingId(id);
      setShowForm(true);
    } catch {
      toast.error('Failed to load service');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateAdminService(editingId, formData);
        toast.success('Service updated successfully');
      } else {
        await createAdminService(formData);
        toast.success('Service created successfully');
      }
      setFormData(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service permanently?')) return;
    try {
      await deleteAdminService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success('Service deleted');
    } catch {
      toast.error('Failed to delete service');
    }
  };

  const handleBenefitsChange = (value) => {
    setFormData({ ...formData, benefits: value.split('\n').filter((b) => b.trim()) });
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400 font-medium">Super Admin</p>
            <h1 className="text-xl font-bold text-slate-800">Services Management</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/dashboard" className="btn-secondary !px-4 !py-2 text-xs">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <button onClick={openNew} className="btn-primary !px-4 !py-2 text-xs">
              <Plus className="w-4 h-4" />
              New Service
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        {/* Stats bar */}
        <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <Zap className="w-4 h-4 text-blue-500" />
          <span><strong className="text-slate-700">{services.length}</strong> service{services.length !== 1 ? 's' : ''} total</span>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-card p-16 text-center text-slate-400">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading services…
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-20 text-center text-slate-400">
            <Zap className="w-12 h-12 mx-auto mb-3 text-slate-200" />
            <p className="font-medium text-slate-500">No services yet</p>
            <p className="text-sm mt-1">Click "New Service" to add your first one.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 w-10">#</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Service</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hidden md:table-cell">Description</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Price</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hidden lg:table-cell">Duration</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hidden sm:table-cell">Color</th>
                    <th className="px-5 py-3.5 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {services.map((service, index) => (
                    <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 text-xs text-slate-400 font-medium">{index + 1}</td>

                      {/* Service name */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800">{service.title}</div>
                        {service.slug && (
                          <div className="text-xs text-slate-400 mt-0.5 font-mono">{service.slug}</div>
                        )}
                      </td>

                      {/* Description */}
                      <td className="px-5 py-4 text-slate-500 hidden md:table-cell">
                        <div className="max-w-xs line-clamp-2 text-xs leading-relaxed">{service.description}</div>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-slate-700 font-semibold text-sm whitespace-nowrap">
                          <IndianRupee className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{service.price?.replace(/^Starting from ₹/, '') || service.price}</span>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-5 py-4 hidden lg:table-cell">
                        {service.duration ? (
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs whitespace-nowrap">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {service.duration}
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Color badge */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${COLOR_MAP[service.color] || 'bg-slate-100 text-slate-600'}`}>
                          {service.color}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(service.id)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
              <h2 className="font-bold text-slate-800 text-lg">
                {editingId ? 'Edit Service' : 'New Service'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable form body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="Service title"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="form-label">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="input-field font-mono text-sm"
                    placeholder="service-slug"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="input-field"
                  >
                    {ICONS.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Color</label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="input-field"
                  >
                    {COLORS.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Price</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input-field"
                    placeholder="Starting from ₹500"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="input-field"
                    placeholder="30–45 minutes"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Short Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field resize-none"
                  rows="2"
                  placeholder="Brief description…"
                  required
                />
              </div>

              <div>
                <label className="form-label">Long Description</label>
                <textarea
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  className="input-field resize-none"
                  rows="3"
                  placeholder="Detailed description…"
                />
              </div>

              <div>
                <label className="form-label">Benefits <span className="text-slate-400 font-normal">(one per line)</span></label>
                <textarea
                  value={formData.benefits?.join('\n')}
                  onChange={(e) => handleBenefitsChange(e.target.value)}
                  className="input-field resize-none font-mono text-xs"
                  rows="4"
                  placeholder={"Benefit 1\nBenefit 2\nBenefit 3"}
                />
              </div>

              <div className="flex gap-3 pt-2 pb-1">
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
                  {submitting ? 'Saving…' : editingId ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
