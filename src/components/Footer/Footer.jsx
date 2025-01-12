/* eslint-disable no-unused-vars */
import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import MapComponent from "./MapComponent"; // Import the MapComponent you created

const FooterLinks = [
  {
    title: "Home",
    link: "/#home",
  },
  {
    title: "About",
    link: "/#about",
  },
  {
    title: "Services",
    link: "/#service",
  },
  {
    title: "Contact",
    link: "/#contact",
  },
];

const Footer = () => {
  return (
    <div className="bg-sky-900 text-white">
      <section className="container py-8">
        <div className="flex flex-wrap justify-between items-start gap-8 py-5">
          {/* Company Details */}
          <div className="flex-1 min-w-[250px] py-8 px-4">
            <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3 text-white">
             Our Contact
            </h1>

            <p className="mt-4 text-white">
              <strong>Phone:</strong> +250 788 457 408
            </p>
            <p className="mt-2 text-white">
              <strong>Email:</strong> princemugabe568@gmail.com
            </p>
            <p className="mt-2 text-whitey">
              <strong>Location:</strong> Kigali, Rwanda
            </p>
            
          </div>

          <div className="flex-1 min-w-[250px] py-8 px-4">
          <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3 text-white">
            Our Location
            </h1>
        
            <p className="mt-4 text-white">
              <strong>Kigali, Rwanda</strong>
            </p>
            <p className="mt-2 text-white">
              <strong>Gasabo District </strong>
            </p>
            <p className="mt-2 text-white">
              <strong>Kacyiru Sector </strong>
            </p>
            
          </div>


          {/* Map Section */}
          <div className="flex-1 min-w-[250px] py-8 px-4">
            <h1 className="text-xl font-bold mb-4">Our Location in Rwanda</h1>
            <div className="overflow-hidden rounded-lg shadow-lg">
              <MapComponent />
            </div>
          </div>
        </div>
      </section>

      {/* Copyright Section */}
      <div className="bg-gray-700 py-2 text-center text-white">
        <p>&copy; {new Date().getFullYear()}. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
