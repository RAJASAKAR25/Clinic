import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout    from './layouts/MainLayout.jsx';
import Home          from './pages/Home.jsx';
import About         from './pages/About.jsx';
import Services      from './pages/Services.jsx';
import BookAppointment from './pages/BookAppointment.jsx';
import Contact       from './pages/Contact.jsx';
import AdminLogin    from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminBilling from './pages/AdminBilling.jsx';
import BillsHistory from './pages/BillsHistory.jsx';
import AdminFAQs from './pages/AdminFAQs.jsx';
import AdminServices from './pages/AdminServices.jsx';
import AdminTestimonials from './pages/AdminTestimonials.jsx';
import NotFound      from './pages/NotFound.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <BrowserRouter>
      {/* Public pages wrapped in Navbar + Footer layout */}
      <Routes>
        <Route element={<MainLayout />}>
          <Route index             element={<Home />} />
          <Route path="about"      element={<About />} />
          <Route path="services"   element={<Services />} />
          <Route path="book-appointment" element={<BookAppointment />} />
          <Route path="contact"    element={<Contact />} />
        </Route>

        {/* Admin authentication */}
        <Route path="admin"          element={<AdminLogin />} />

        {/* Admin dashboard — requires valid JWT in localStorage */}
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/billing"
          element={
            <ProtectedRoute>
              <AdminBilling />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/bills-history"
          element={
            <ProtectedRoute>
              <BillsHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/faqs"
          element={
            <ProtectedRoute>
              <AdminFAQs />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/services"
          element={
            <ProtectedRoute>
              <AdminServices />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/testimonials"
          element={
            <ProtectedRoute>
              <AdminTestimonials />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* WhatsApp floating widget appears on all pages */}
      <WhatsAppButton />
    </BrowserRouter>
  );
}

export default App;
