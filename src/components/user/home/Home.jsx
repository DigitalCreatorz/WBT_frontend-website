// Home.js
import React from "react";
import "./home.css"; // Create a CSS file for Home-specific styles

const Home = () => {
  return (
    <div className="home-container">
      {/* Full-screen video */}
      <div className="video-container">
        <video className="fullscreen-video" autoPlay loop>
          <source src="/img/plane.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

      </div>
        {/* <button>Hello</button> */}
      {/* Optional Home Page Content */}
      {/* <div className="home-content">
        <h1>Welcome to Our Website</h1>
        <p>This is the home page with a full-screen video background.</p>
        <button>Inquire Now</button>
      </div> */}
    </div>
  );
};

export default Home;
