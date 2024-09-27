import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
// import Home from './components/user/home/Home';
// import Navbar from './components/user/navbar/Navbar';
// import Error from './components/Error';
// import UserLayout from './components/user/UserLayout';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/user/home/Home";
import Navbar from "./components/user/navbar/Navbar";
import Error from './components/Error';
import UserLayout from "./components/user/UserLayout";
import Inquiry from './components/user/inquiry/Inquiry';
import Contact from './components/user/contact/Contact';


function App() {
  return (
    <BrowserRouter>
    

      <Navbar />
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
            </Route>

            <Route path="/contact" element={<Contact />} />
            <Route path="/inquiry" element={<Inquiry />} />
            <Route path="*" element={<Error />} />
          </Routes> 
        </main>
      </div>
    </BrowserRouter>
  );
}
{/* Admin Routes */ }
{/* <Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} /> */}
{/* </Route> */ }

export default App;
