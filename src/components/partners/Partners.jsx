/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import meteo from '../../assets/pictures/meteo.jpg';

import rema from '../../assets/pictures/rema.jpg';
import minema from '../../assets/pictures/minema.jpeg';


const Partners = () => {
  const partners = [
    { name: "METEO Rwanda", url: "https://www.meteorwanda.gov.rw/", image: meteo },
    { name: "REMA", url: "https://www.rema.gov.rw/", image: rema },
    { name: "MINEMA", url: "https://www.minema.gov.rw/", image: minema },
    
  ];

  const partnersPerPage = 3;
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(partners.length / partnersPerPage);

  const navigateToPartner = (url) => {
    window.open(url, "_blank");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPage((prevPage) => (prevPage + 1) % pageCount);
    }, 7000);

    return () => clearInterval(timer);
  }, [pageCount]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pageCount) % pageCount);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pageCount);
  };

  const currentPartners = partners.slice(
    currentPage * partnersPerPage,
    (currentPage + 1) * partnersPerPage
  );

  return (
    <section id="partner">
      <div className="bg-gray-100 dark:text-white py-12 sm:grid sm:place-items-center">
        <div className="container">
          <div className="pb-12 text-center space-y-3">
            <div className="bg-gray-300 py-2 mt-2">
              <h1
                data-aos="fade-up"
                className="text-3xl font-semibold sm:text-3xl text-black dark:text-black"
              >
                Our Partners
              </h1>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4">
              {currentPartners.map((partner, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-100 rounded-lg shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-xl p-6"
                  data-aos="fade-up"
                  data-aos-delay={index * 300}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-blue-500 transition-colors duration-300">
                      <img
                        src={partner.image}
                        alt={partner.name}
                        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-900 mb-4">
                      {partner.name}
                    </h2>
                    <div 
                      onClick={() => navigateToPartner(partner.url)}
                      className="flex items-center space-x-2 text-sky-900 hover:text-gray-900 cursor-pointer group/link"
                    >
                      <span className="font-medium">Visit Website</span>
                      <ArrowUpRight className="w-5 h-5 transition-transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pageCount > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                  onClick={handlePrevPage}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex space-x-2">
                  {[...Array(pageCount)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`w-3 h-3 rounded-full transition ${
                        currentPage === index
                          ? "bg-sky-900"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to page ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;