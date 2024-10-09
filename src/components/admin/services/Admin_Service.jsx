import React, { useState, useEffect } from 'react';
import { CONFIGS } from '../../../../config';
import { FaEdit } from 'react-icons/fa'; // Import Edit Icon from FontAwesome

function Admin_Service() {
  const [services, setServices] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [currentService, setCurrentService] = useState(null); // Store the service to be edited
  const [newService, setNewService] = useState({
    name: '',
    desc: '',
    image: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(5);

  // Fetch Services Data
  useEffect(() => {
    fetchServices();
  }, [currentPage]);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/getservice`);
      const data = await response.json();

      setServices(data.message);
      setTotalPages(Math.ceil(data.message.length / itemsPerPage));
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Handle Add Service Form Submission
  const handleAddService = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newService.name);
    formData.append('desc', newService.desc);
    if (newService.image) {
      formData.append('image', newService.image);
    }

    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/addservice`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setShowAddPopup(false);
        fetchServices(); // Refresh services list
        setNewService({ name: '', desc: '', image: null }); // Reset form
      } else {
        const result = await response.json();
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  // Handle Edit Service
  const handleEditService = (service) => {
    setCurrentService(service);
    setShowEditPopup(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', currentService.name);
    formData.append('desc', currentService.desc);
    
    // Only append new image if it exists
    if (currentService.image) {
      formData.append('image', currentService.image);
    }

    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/editservice/${currentService._id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setShowEditPopup(false);
        fetchServices(); // Refresh services list
      } else {
        const result = await response.json();
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error editing service:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewService({ ...newService, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setCurrentService({ ...currentService, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewService({ ...newService, image: e.target.files[0] });
    }
  };

  const handleEditFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentService({ ...currentService, image: e.target.files[0] });
    } else {
      // If no file selected, retain the existing image
      setCurrentService({ ...currentService, image: currentService.image });
    }
  };

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = services.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mx-auto p-4 mt-10 m-10">
      <h1 className="text-2xl font-bold mb-4">Admin Services</h1>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4"
        onClick={() => setShowAddPopup(true)}
      >
        Add New Service
      </button>

      <table className="w-full bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Description</th>
            <th className="py-2 px-4 border">Image</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((service) => (
              <tr key={service._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{service.name}</td>
                <td className="py-2 px-4 border">{service.desc}</td>
                <td className="py-2 px-4 border">
                  {service.image ? (
                    <img src={service.image} alt={service.name} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td className="py-2 px-4 border text-center">
                  <button onClick={() => handleEditService(service)} className="text-blue-500 hover:text-blue-700">
                    <FaEdit /> {/* Edit Icon */}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-4 text-center">
                No services available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          onClick={() => handlePageChange('prev')}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          onClick={() => handlePageChange('next')}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Add Service Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Service</h2>
            <form onSubmit={handleAddService}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  name="name"
                  value={newService.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  name="desc"
                  value={newService.desc}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                  onClick={() => setShowAddPopup(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Popup */}
      {showEditPopup && currentService && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Service</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentService.name}
                  onChange={handleEditInputChange}
                  required
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                  name="desc"
                  value={currentService.desc}
                  onChange={handleEditInputChange}
                  required
                  rows={4}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Current Image</label>
                {currentService.image && (
                  <img src={currentService.image} alt={currentService.name} className="w-16 h-16 object-cover rounded mb-2" />
                )}
                <label className="block text-gray-700 mb-1">Upload New Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditFileChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                  onClick={() => setShowEditPopup(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                  Update Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin_Service;
