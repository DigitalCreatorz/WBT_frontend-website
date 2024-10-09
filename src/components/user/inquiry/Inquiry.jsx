import React, { useState } from 'react'
import './inquiry.css'
import { CONFIGS } from '../../../../config';
// import '../home/home.css';
function Inquiry() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    tentative_month: '',
    note: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${CONFIGS.API_BASE_URL}/addinquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    console.log('Form submitted:', response);
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      destination: '',
      tentative_month: '',
      note: ''
    });
  };
  return (
    <>
      <div className=" bg-slate-500">

        <div className="inquiry_container">

          <form
            onSubmit={handleSubmit}
            className="space-y-6 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-bold text-center mb-6">Travel Inquiry</h2>

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                min={10}
                // max={10}
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                Destination
              </label>
              <input
                id="destination"
                name="destination"
                type="text"
                value={formData.destination}
                onChange={handleChange}
                required
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="tentative_month" className="block text-sm font-medium text-gray-700">
                Tentative Month
              </label>
              <select
                id="tentative_month"
                name="tentative_month"
                value={formData.tentative_month}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="" disabled>
                  Select month
                </option>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(
                  (month) => (
                    <option key={month} value={month.toLowerCase()}>
                      {month}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                id="note"
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={4}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
        Submit Inquiry
      </button> */}


            <button type="submit" className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
              <span className="relative px-36 py-3.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Submit Inquiry
              </span>
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Inquiry