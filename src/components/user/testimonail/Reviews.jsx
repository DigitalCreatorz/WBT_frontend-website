import React, { useEffect, useState } from 'react';
import './review.css';
import { CONFIGS } from '../../../../config';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa'; // Import quote icons

function Reviews() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${CONFIGS.API_BASE_URL}/getVerifiedtestimonail`, {
          method: "GET"
        });
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }
        const data = await response.json();
        setTestimonials(data.message || []); // Assuming the testimonials are in the 'message' property
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Rotate testimonials every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) =>
        (prevIndex + 1) % testimonials.length
      );
    }, 5000); // Change testimonials every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [testimonials]);

  // Display loading message while fetching data
  if (loading) {
    return <p className="text-center">Loading testimonials...</p>;
  }

  // If no testimonials are available, show a message
  if (testimonials.length === 0) {
    return <p className="text-center">No testimonials available.</p>;
  }

  // Get the current testimonial to display
  const currentTestimonial = testimonials[currentTestimonialIndex];

  return (
    <div className="review-container">
      <div className="inquiry_container text-center">
        <b className="heading">TESTIMONIALS</b>
      </div>

      {/* Testimonial Card */}
      <div className="testimonial-card">
        {/* Quote icons on left and right borders */}
        <div className="quote-icon-left">
          <FaQuoteLeft />
        </div>
        <div className="quote-icon-right">
          <FaQuoteRight />
        </div>

        {/* Testimonial Content */}
        <div className="testimonial-content">
          <img src={currentTestimonial.image} alt="" className="testimonial-image"/>
          <h2 className="testimonial-name">{currentTestimonial.cust_name}</h2>
          <p className="testimonial-desc">{currentTestimonial.message}</p>
        </div>
      </div>
    </div>
  );
}

export default Reviews;
