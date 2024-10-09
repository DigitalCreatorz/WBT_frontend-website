import React, { useEffect, useState, useRef } from "react";
import "./home.css"; // Custom CSS styles
import { CONFIGS } from "../../../../config";
import { PiGreaterThanLight, PiLessThanLight } from "react-icons/pi";
import { useAuth } from "../../../store/Auth"; // Importing useAuth
import { useNavigate } from "react-router-dom"; // Importing useNavigate

const Home = () => {
  const [homeData, setHomeData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const photoGalleryRef = useRef(null);
  const { user } = useAuth(); // Get the user data from context
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchHomeData = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/gethome`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const result = await response.json();
      if (result && Array.isArray(result.message)) {
        setHomeData(result.message);
      } else {
        console.error("Expected data to be an array, but received:", result);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    // Check user role and navigate if admin
    if (user.role === 'admin') {
      navigate('/admin/home'); // Redirect to admin page
    }
    
    const interval = setInterval(() => {
      handleNext();
    }, 10000);

    return () => clearInterval(interval);
  }, [homeData, user.role, navigate]); // Include user.role and navigate in dependency array

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % homeData.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + homeData.length) % homeData.length);
  };

  return (
    <div className="home-container">
      {loading ? (
        <p>Loading...</p>
      ) : homeData.length > 0 ? (
        <div
          className="continent-section"
          style={{
            backgroundImage: `url(${homeData[currentIndex].cover_img})`,
            transition: "background-image 1s ease-in-out",
          }}
        >
          <div className="left-section">
            <h1 className="continent-name">{homeData[currentIndex].name}</h1>
            <p className="continent-desc">{homeData[currentIndex].desc}</p>
          </div>

          <div className="right-section">
            <div className="photo-gallery" ref={photoGalleryRef}>
              {homeData[currentIndex].photos &&
                homeData[currentIndex].photos.map((photo, idx) => (
                  <div key={idx} className="photo-container">
                    <img src={photo.url} alt={`Photo ${idx + 1}`} className="photo-item" />
                    <div className="photo-overlay">
                      <p className="photo-title">{photo.title}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="navigation-buttons">
            <button onClick={handlePrevious} className="nav-button">
              <PiLessThanLight />
            </button>
            <button onClick={handleNext} className="nav-button">
              <PiGreaterThanLight />
            </button>
          </div>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Home;
