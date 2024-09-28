import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaBars } from 'react-icons/fa';
import { AiFillProduct } from 'react-icons/ai';
import { GoListOrdered } from 'react-icons/go';
import { VscFeedback } from 'react-icons/vsc';
import { FaUsers } from 'react-icons/fa';
import { CiCalendarDate } from 'react-icons/ci';
import { IoIosContact } from 'react-icons/io';
import { NavLink } from 'react-router-dom';
import { IoLogOutOutline } from 'react-icons/io5';
import { MdOutlineArchive } from 'react-icons/md';
import './adminsidebar.css'

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
  <div className="toggle_container">
    <button className="sidebar-toggle" onClick={toggleSidebar}>
      {isOpen ? <FaTimes /> : <FaBars />}
    </button>
  </div>

  <div ref={sidebarRef} className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
    <h2>Admin Dashboard</h2>
    <hr />
    <ul>
      <li>
        <NavLink to="/admin/inquiry" activeClassName="active">
          <AiFillProduct className="me-2" /> Inquiries
        </NavLink>
      </li>
      <li>
        <NavLink to="/admin/contact" activeClassName="active">
          <GoListOrdered className="me-2" /> Admin Contact
        </NavLink>
      </li>
      <li>
        <NavLink to="/admin/testimonail" activeClassName="active">
          <VscFeedback className="me-2" /> Success Stories
        </NavLink>
      </li>
      
      <li>
        <NavLink to="/logout" className="logout">
          <IoLogOutOutline className="me-2" /> Logout
        </NavLink>
      </li>
    </ul>
  </div>
</div>

  );
};

export default AdminSidebar;
