import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './testimonial.css';
import { CONFIGS } from '../../../../config';

function Testimonials() {
  const [newTestimonial, setNewTestimonial] = useState({
    cust_name: '',
    message: '',
    image: null,
    verify: false,
    contact_number: '',
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (name, value) => {
    setNewTestimonial((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    setNewTestimonial({ ...newTestimonial, image: event.target.files[0] });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('cust_name', newTestimonial.cust_name);
      formData.append('message', newTestimonial.message);
      formData.append('contact_number', newTestimonial.contact_number);
      formData.append('verify', newTestimonial.verify);

      if (newTestimonial.image) {
        formData.append('image', newTestimonial.image); // Ensure this is a File object
      }

      const response = await fetch(`${CONFIGS.API_BASE_URL}/addtestimonail`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        toast.success('Testimonial added successfully!', {
          position: 'top-center',
          autoClose: 5000
        });
        setNewTestimonial({
          cust_name: '',
          message: '',
          image: null,
          verify: false,
          contact_number: '',
        });
      } else {
        const result = await response.json();
        toast.error(`Error: ${result.Message}`);
      }
    } catch (error) {
      toast.error('Error adding testimonial');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <div className="bg-pink-300">

      <div className="inquiry_container flex flex-col items-center">
      <h1 className="text-2xl font-bold mt-3">Share Your Review</h1>
        {/* <div className="mb-4">
          <img src="/img/review.svg" alt="Reviews" className="w-1/2 h-auto" />
          </div> */}

        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg" onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="formCustName">
              Customer Name
            </label>
            <input
              type="text"
              required
              placeholder="Enter customer name"
              value={newTestimonial.cust_name}
              onChange={(e) => handleInputChange('cust_name', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="formCustName">
              Customer Number
            </label>
            <input
              type="text"
              required
              placeholder="Enter customer number"
              value={newTestimonial.contact_number}
              onChange={(e) => handleInputChange('contact_number', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="formMessage">
              Message
            </label>
            <textarea
              required
              rows={3}
              placeholder="Enter testimonial message"
              value={newTestimonial.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="formImage">
              Upload Your Image/Video
            </label>
            <input
              type="file"
              onChange={(e) => setNewTestimonial({ ...newTestimonial, image: e.target.files[0] })}
              className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded file:cursor-pointer hover:file:bg-gray-100"
              />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={saving}
            >
            {saving ? 'Saving...' : 'Submit'}
          </button>
        </form>
      </div>
              </div>
    </>
  );
}

export default Testimonials;
