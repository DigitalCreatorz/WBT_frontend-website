import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../store/Auth';

function AdminLayout() {
  const { user, isLoading } = useAuth();

  console.log("User Data:", user);
  console.log("Is Admin:", user.role==="admin");

  if (isLoading) {
    return (
      <div className="text-center">
        <img
          src="https://cdn.dribbble.com/userupload/6665658/file/original-a7d9005448729a1860ed9be4205b660b.gif"
          alt="Loading..."
          height={50}
          className="error_img mt-3 m-3"
        />
      </div>
    );
  }

  if (!user || !user.role==="admin") {
    console.log("Redirecting to home because user is not admin.");
    return <Navigate to="/" />;
  }

  return (
    <>
      <AdminSidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
}

export default AdminLayout;
