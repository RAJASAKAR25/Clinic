import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Smile, LogOut, RefreshCw, Calendar, MessageSquare,
  Clock, User, Phone, Mail, ChevronDown, ReceiptText, Files,
  FileText, Zap, MessageCircle,
} from 'lucide-react';
import {
  getAdminAppointments, getAdminMessages, updateAdminMessageReadStatus, updateAppointmentStatus,
} from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import toast from 'react-hot-toast';
import clinicLogo from '../../assets/Clinic_Logo.svg';

const TABS = ['appointments', 'messages'];
const APPOINTMENT_FILTERS = ['all', 'today', 'pending', 'confirmed', 'completed', 'cancelled'];
const MESSAGE_FILTERS = ['all', 'unread', 'read'];
const APPOINTMENT_FILTER_LABELS = {
  all: 'All',
  today: 'Today',
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
const MESSAGE_FILTER_LABELS = {
  all: 'All',
  unread: 'Unread',
  read: 'Read',
};

const localDateKey = (value) => {
  const date = new Date(value || new Date());
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const StatusBadge = ({ status }) => {
  const map = { pending: 'badge-pending', confirmed: 'badge-confirmed', cancelled: 'badge-cancelled', completed: 'badge-completed' };
  return <span className={map[status] || 'badge-pending'}>{status}</span>;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab,          setTab]          = useState('appointments');
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [messageFilter, setMessageFilter] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [messages,     setMessages]     = useState([]);
  const [loading,      setLoading]      = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [apptRes, msgRes] = await Promise.all([getAdminAppointments(), getAdminMessages()]);
      setAppointments(apptRes.data.data || []);
      setMessages(msgRes.data.data || []);
    } catch {
      toast.error('Failed to load data. You may need to log in again.');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []); // eslint-disable-line

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
    toast.success('Logged out');
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleMessageReadChange = async (id, read) => {
    try {
      await updateAdminMessageReadStatus(id, read);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
      toast.success(read ? 'Marked as read' : 'Marked as unread');
    } catch {
      toast.error('Failed to update message status');
    }
  };

  const pending   = appointments.filter((a) => a.status === 'pending').length;
  const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
  const completed = appointments.filter((a) => a.status === 'completed').length;
  const cancelled = appointments.filter((a) => a.status === 'cancelled').length;
  const todayCount = appointments.filter((a) => localDateKey(a.date) === localDateKey(new Date())).length;
  const unread    = messages.filter((m) => !m.read).length;

  const filteredAppointments = useMemo(() => {
    if (appointmentFilter === 'all') return appointments;
    if (appointmentFilter === 'today') {
      const today = localDateKey(new Date());
      return appointments.filter((a) => localDateKey(a.date) === today);
    }
    return appointments.filter((a) => a.status === appointmentFilter);
  }, [appointments, appointmentFilter]);

  const filterCounts = {
    all: appointments.length,
    today: todayCount,
    pending,
    confirmed,
    completed,
    cancelled,
  };

  const filteredMessages = useMemo(() => {
    if (messageFilter === 'all') return messages;
    if (messageFilter === 'read') return messages.filter((m) => m.read);
    return messages.filter((m) => !m.read);
  }, [messages, messageFilter]);

  const messageFilterCounts = {
    all: messages.length,
    unread,
    read: messages.length - unread,
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Topbar */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
              <img
                src={clinicLogo}
                alt="Sekhar's Dental Clinic logo"
                className="w-9 h-9 object-contain transition-transform duration-200 group-hover:scale-110"
              />
            <div>
              <span className="text-sm font-bold text-slate-800">Sekhar's Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/billing"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-700 font-medium px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ReceiptText className="w-4 h-4" />
              Billing
            </Link>
            <Link
              to="/admin/bills-history"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-700 font-medium px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Files className="w-4 h-4" />
              Bills
            </Link>
            <Link
              to="/admin/faqs"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-700 font-medium px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
              FAQs
            </Link>
            <Link
              to="/admin/services"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-700 font-medium px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Zap className="w-4 h-4" />
              Services
            </Link>
            <Link
              to="/admin/testimonials"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-700 font-medium px-3 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Testimonials
            </Link>
            <button
              onClick={fetchAll}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-card w-fit">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                if (t === 'appointments') {
                  setAppointmentFilter('all');
                }
              }}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                tab === t
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
              aria-pressed={tab === t}
            >
              {t}
              {t === 'appointments' && pending > 0 && (
                <span className="ml-2 bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full font-bold">
                  {pending}
                </span>
              )}
              {t === 'messages' && unread > 0 && (
                <span className="ml-2 bg-red-400 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                  {unread}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === 'appointments' && (
          <div className="mb-4 space-y-3">
            <div className="flex flex-wrap gap-2 bg-white rounded-xl p-2 shadow-card">
              {APPOINTMENT_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setAppointmentFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    appointmentFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {APPOINTMENT_FILTER_LABELS[filter]} ({filterCounts[filter]})
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Showing {filteredAppointments.length} {APPOINTMENT_FILTER_LABELS[appointmentFilter].toLowerCase()} appointment(s)
            </p>
          </div>
        )}

        {tab === 'messages' && (
          <div className="mb-4 space-y-3">
            <div className="flex flex-wrap gap-2 bg-white rounded-xl p-2 shadow-card">
              {MESSAGE_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setMessageFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    messageFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {MESSAGE_FILTER_LABELS[filter]} ({messageFilterCounts[filter]})
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Showing {filteredMessages.length} {MESSAGE_FILTER_LABELS[messageFilter].toLowerCase()} message(s)
            </p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Loading data…" />
        ) : tab === 'appointments' ? (
          <AppointmentsTable data={filteredAppointments} onStatusChange={handleStatusChange} filter={appointmentFilter} />
        ) : (
          <MessagesTable data={filteredMessages} onReadChange={handleMessageReadChange} filter={messageFilter} />
        )}
      </main>
    </div>
  );
};

/* ── Appointments Table ───────────────────────────────────────────────────── */
const AppointmentsTable = ({ data, onStatusChange, filter }) => {
  if (!data.length) {
    const emptyMsg = filter && filter !== 'all'
      ? `No ${filter} appointments.`
      : 'No appointments yet.';
    return <EmptyState icon={Calendar} message={emptyMsg} />;
  }

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label="Appointments table">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['Patient', 'Contact', 'Service', 'Notes', 'Date & Time', 'Status', 'Action'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((appt) => (
              <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {appt.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-800">{appt.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{appt.phone}</span>
                    {appt.email && <span className="flex items-center gap-1 text-xs"><Mail className="w-3 h-3" />{appt.email}</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700 font-medium">{appt.service}</td>
                <td className="px-4 py-3 text-slate-600">
                  {appt.message ? (
                    <p className="max-w-xs whitespace-pre-wrap break-words text-xs leading-relaxed">{appt.message}</p>
                  ) : (
                    <span className="text-xs text-slate-400">No notes</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <span>{new Date(appt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <br />
                  <span className="text-xs text-slate-400">{appt.time}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={appt.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="relative">
                    <select
                      value={appt.status}
                      onChange={(e) => onStatusChange(appt.id, e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 pr-7 bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-400 appearance-none cursor-pointer"
                      aria-label={`Update status for ${appt.name}`}
                    >
                      {['pending', 'confirmed', 'cancelled', 'completed'].map((s) => (
                        <option key={s} value={s} className="capitalize">{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ── Messages Table ───────────────────────────────────────────────────────── */
const MessagesTable = ({ data, onReadChange, filter }) => {
  if (!data.length) {
    const emptyMsg = filter && filter !== 'all'
      ? `No ${filter} messages.`
      : 'No messages yet.';
    return <EmptyState icon={MessageSquare} message={emptyMsg} />;
  }

  return (
    <div className="space-y-4">
      {data.map((msg) => (
        <div key={msg.id} className={`bg-white rounded-xl shadow-card p-5 border ${msg.read ? 'border-transparent' : 'border-blue-200'}`}>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                {msg.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{msg.name}</p>
                <p className="text-xs text-slate-400">{msg.email}{msg.phone ? ` · ${msg.phone}` : ''}</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${msg.read ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700'}`}>
                {msg.read ? 'Read' : 'Unread'}
              </span>
              <p className="text-xs text-slate-400 whitespace-nowrap">
                {new Date(msg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
          {msg.subject && (
            <p className="text-xs font-semibold text-blue-600 mb-1">{msg.subject}</p>
          )}
          <p className="text-sm text-slate-600 leading-relaxed">{msg.message}</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => onReadChange(msg.id, !msg.read)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              {msg.read ? 'Mark as Unread' : 'Mark as Read'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyState = ({ icon: Icon, message }) => (
  <div className="bg-white rounded-xl shadow-card py-20 text-center">
    <Icon className="w-10 h-10 text-slate-200 mx-auto mb-3" />
    <p className="text-slate-400 text-sm">{message}</p>
  </div>
);

export default AdminDashboard;
