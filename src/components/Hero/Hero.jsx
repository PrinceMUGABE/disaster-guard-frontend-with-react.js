/* eslint-disable no-unused-vars */
import React from "react";
import hero from "../../assets/pictures/Background-Image.png";

const Hero = () => {
  const handleGetStarted = () => {
    // Navigate to the /login route
    window.location.href = "/login";
  };

  return (
    <div
      className="bg-gradient-to-b from-gray-100 to-gray-200 pt-36 relative"
      id="home"
      style={{
        backgroundImage: `url(${hero})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh", // Ensures the background covers the full height
      }}
    >
      {/* Optional overlay to improve text readability */}
      <div className="absolute inset-0 bg-black/40 px-4"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center px-16 ml-8 mt-16">
        {/* Text section with enhanced visibility */}
        <h1
          data-aos="fade-up"
          className="text-4xl sm:text-5xl font-bold text-white leading-tight"
        >
          Empowering Disaster Preparedness with{" "}
          <span className="text-sky-900 extrabold">
            DisasterGuard
          </span>
        </h1>
        <br />
        <p
          data-aos="fade-up"
          data-aos-delay="300"
          className="text-white text-lg leading-relaxed py-4"
        >
          DisasterGuard is a cutting-edge platform designed to enhance disaster 
          preparedness and response efforts. By leveraging AI and geospatial 
          analysis, we help teams assess risks, plan effectively, and coordinate 
          responses swiftly, ensuring community safety and resilience during crises.
        </p>
        <br />
        <div data-aos="fade-up" data-aos-delay="400" className="pt-4 mb-8">
          <div
            data-aos="fade-up"
            data-aos-delay="900"
            data-aos-offset="0"
            className="text-center mt-8"
          >
            <button
              onClick={handleGetStarted}
              className="primary-btn bg-white text-black hover:bg-gray-700 hover:text-white"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
