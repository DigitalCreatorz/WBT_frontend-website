import React, { useEffect, useState } from 'react';
import 'rsuite/dist/rsuite.min.css';
import { CONFIGS } from '../../../../config';

const CustomPackageForm = () => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    destination: '',
    noofnight: '',
    attraction: [], // Updated from attractions to attraction
    hotel_rating: '',
    include_flight: false,
    include_visa: false,
    include_extrasevice: '',
  });

  // Fetch unique countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/unqiuecountry`);
        const data = await response.json();
        if (Array.isArray(data.message)) {
          setCountries(data.message.map(country => ({ label: country, value: country })));
        } else {
          console.error('Countries data is not an array:', data.message);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  // Fetch unique cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/unqiuecity`);
        const data = await response.json();
        if (Array.isArray(data.message)) {
          setCities(data.message.map(city => ({ label: city, value: city })));
        } else {
          console.error('Cities data is not an array:', data.message);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  // Fetch attractions based on selected city
  useEffect(() => {
    if (selectedCity) {
      const fetchAttractions = async () => {
        try {
          const response = await fetch(`${CONFIGS.API_BASE_URL}/attraction/${selectedCity}`);
          const data = await response.json();
          if (Array.isArray(data.message)) {
            setAttractions(data.message);
          } else {
            console.error('Attractions data is not an array:', data.message);
          }
        } catch (error) {
          console.error('Error fetching attractions:', error);
        }
      };

      fetchAttractions();
    }
  }, [selectedCity]);

  // Handle form field changes
  const handleChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle attraction checkbox changes
  const handleAttractionChange = (attraction, isChecked) => {
    setFormData((prev) => ({
      ...prev,
      attraction: isChecked
        ? [...prev.attraction, attraction]
        : prev.attraction.filter((attr) => attr !== attraction),
    }));
  };

  // Handle attraction removal
  const handleRemoveAttraction = (attractionToRemove) => {
    setFormData((prev) => ({
      ...prev,
      attraction: prev.attraction.filter((attraction) => attraction !== attractionToRemove),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/addcustom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Custom package created successfully:', result);
        alert('Package created successfully!');
        setFormData({
          name: '',
          number: '',
          destination: '',
          noofnight: '',
          attraction: [], // Reset field
          hotel_rating: '',
          include_flight: false,
          include_visa: false,
          include_extrasevice: '',
        });
      } else {
        console.error('Failed to create package:', response.statusText);
        alert('Failed to create package!');
      }
    } catch (error) {
      console.error('Error in submitting form:', error);
    }
  };

  return (
    <div className="bg-fuchsia-300 pt-28">
      <div className="max-w-md mx-auto p-5 bg-slate-100 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Custom Package</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => handleChange(e.target.value, 'name')}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="number" className="block text-sm font-medium text-gray-700">Number:</label>
            <input
              id="number"
              type="text"
              name="number"
              value={formData.number}
              onChange={(e) => handleChange(e.target.value, 'number')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="noofnight" className="block text-sm font-medium text-gray-700">No. of Nights:</label>
            <input
              id="noofnight"
              type="text"
              name="noofnight"
              value={formData.noofnight}
              onChange={(e) => handleChange(e.target.value, 'noofnight')}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination:</label>
            <select
              id="destination"
              value={formData.destination}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                handleChange(e.target.value, 'destination');
              }}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            >
              <option value="">Select Destination</option>
              {cities.map((city) => (
                <option key={city.value} value={city.value}>{city.label}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Attractions:</label>
            {attractions.length > 0 ? (
              <div className="mt-2">
                {attractions.map((attraction, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`attraction-${index}`}
                      checked={formData.attraction.includes(attraction)}
                      onChange={(e) => handleAttractionChange(attraction, e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor={`attraction-${index}`} className="ml-2 text-sm text-gray-700">
                      {attraction}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">Select a destination to see attractions</p>
            )}
          </div>

          {formData.attraction.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected Attractions:</p>
              <div className="flex flex-wrap gap-2">
                {formData.attraction.map((attraction, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span className="text-sm">{attraction}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttraction(attraction)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="hotel_rating" className="block text-sm font-medium text-gray-700">Hotel Rating:</label>
            <input
              id="hotel_rating"
              type="text"
              name="hotel_rating"
              value={formData.hotel_rating}
              onChange={(e) => handleChange(e.target.value, 'hotel_rating')}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                id="include_flight"
                type="checkbox"
                name="include_flight"
                checked={formData.include_flight}
                onChange={(e) => handleChange(e.target.checked, 'include_flight')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Include Flight</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                id="include_visa"
                type="checkbox"
                name="include_visa"
                checked={formData.include_visa}
                onChange={(e) => handleChange(e.target.checked, 'include_visa')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Include Visa</span>
            </label>
          </div>

          <div className="mb-4">
            <label htmlFor="include_extrasevice" className="block text-sm font-medium text-gray-700">Include Extra Service:</label>
            <input
              id="include_extrasevice"
              type="text"
              name="include_extrasevice"
              value={formData.include_extrasevice}
              onChange={(e) => handleChange(e.target.value, 'include_extrasevice')}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Create Custom Package
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomPackageForm;
