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
              <Route path="*" element={<Error />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
                <Route path="contact" element={<AdminContact />} />
                <Route path="inquiry" element={<AdminInquiry />} />
                <Route path="testimonail" element={<AdminTestimonails />} />
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
