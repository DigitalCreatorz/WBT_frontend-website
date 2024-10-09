import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/user/home/Home';
import Navbar from './components/user/navbar/Navbar';
import Error from './components/Error';
import UserLayout from './components/user/UserLayout';
import Inquiry from './components/user/inquiry/Inquiry';
import Contact from './components/user/contact/Contact';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/dashboard/AdminDashboard';
import AdminContact from './components/admin/contact/AdminContact';
import Login from './components/admin/login/Login';
import { ToastContainer } from 'react-toastify';
import { Logout } from './components/logout/Logout';
import AdminInquiry from './components/admin/inquiry/AdminInquiry';
import AdminTestimonails from './components/admin/tesimonails/AdminTestimonails';
import AdminHome from './components/admin/home/AdminHome';
import Archive_inquiries from './components/admin/archive/Archive_inquiries';
import Testimonials from './components/user/testimonail/Testimonials';
import CustomPackageForm from './components/user/custom_package/CustomPackageForm';
import Admin_custom from './components/admin/custom_package/Admin_custom';
import Admin_Service from './components/admin/services/Admin_Service';
import Service from './components/user/service/Service';
import Reviews from './components/user/testimonail/Reviews';

function Layout({ children }) {
  const location = useLocation();

  // Hide Navbar if the user is on any admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Conditionally render Navbar */}
      {!isAdminRoute && <Navbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <div className="app-container">
          <main className="main-content">
            <Routes>
              {/* User Routes */}
              <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/inquiry" element={<Inquiry />} />
              <Route path="/testimonial" element={<Testimonials />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/custom" element={<CustomPackageForm />} />
              <Route path="/service" element={<Service />} />
              <Route path="*" element={<Error />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
                <Route path="contact" element={<AdminContact />} />
                <Route path="inquiry" element={<AdminInquiry />} />
                <Route path="testimonail" element={<AdminTestimonails />} />
                <Route path="home" element={<AdminHome />} />
                <Route path="service" element={<Admin_Service />} />
                <Route path="archivetesti" element={<Archive_inquiries />} />
                <Route path="admin_custom" element={<Admin_custom />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Layout>
      <ToastContainer
        position="top-center"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
