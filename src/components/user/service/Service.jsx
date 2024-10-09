import React, { useEffect, useState } from 'react';
import { CONFIGS } from '../../../../config';
import './service.css'; // Import custom CSS for styling

function Service() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/getservice`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // console.log(data);
        setServices(data.message);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="bg-blue-400 service-container">
      <div className="inquiry_container ms-16 me-16">
        <div className="service-header">
          <h1 className='text-4xl text-white'>Our Services</h1>
        </div>
        <div className="service-content ">
          {loading ? (
            <p>Loading services...</p>
          ) : services.length > 0 ? (
            <div className="service-grid">
              {services.map((service) => (
                <div key={service._id} className="service-card ">
                  {/* Service Image */}
                  {service.image && (
                    <div className="service-card-image">
                      <img src={service.image} alt={service.name} className="circle-image" />
                    </div>
                  )}

                  {/* Service Content */}
                  <div className="service-card-content">
                    <h2 className="service-card-title">{service.name}</h2>
                    <p className="service-card-desc">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No services available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Service;
