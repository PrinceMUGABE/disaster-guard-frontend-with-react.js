/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import AboutImg from '../../assets/pictures/imag3.jpg';
import image2 from '../../assets/pictures/image 4.png';
import image3 from '../../assets/pictures/Image 20 (4).png';
import image4 from '../../assets/pictures/Rectangle 157.png';
import image5 from '../../assets/pictures/Rectangle 43.png';
import image6 from '../../assets/pictures/Image 20 (3).png';
import image8 from '../../assets/pictures/Image 20 (2).png';
import image9 from '../../assets/pictures/Image 20 (1).png';
import image10 from '../../assets/pictures/Container 168.png';
import image11 from '../../assets/pictures/Container 168 (1).png';

function About() {
    // Array of images
    const images = [
        AboutImg,
        image2,
        image3,
        image4,
        image5,
        image6,
        image8,
        image9,
        image10,
        image11
    ];

    // State to keep track of the current image index
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // useEffect hook to change the image every 3 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // 3000 ms = 3 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <section id="about" className="py-10 bg-slate-100 dark:text-white">
            <div className='bg-gray-300 mt-2 py-2'>
                <h2
                    data-aos="fade-up"
                    className="text-center text-4xl font-bold mb-10 text-black dark:text-black py-2"
                >
                    About Us
                </h2>
            </div>
            
            <main className="container mx-auto flex flex-col items-center justify-center">

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-4 md:p-8 bg-white rounded-lg shadow-lg">
                    <div data-aos="fade-right">
                        <img
                            src={images[currentImageIndex]} // Display image based on the current index
                            alt="No image"
                            className="w-full h-80 object-cover rounded-lg"
                        />
                    </div>
                    <div data-aos="fade-left" className="flex flex-col gap-4">
                        <div className="p-4 border-l-4 border-gray-700">
                            <h3 className="text-2xl font-semibold mb-2 text-black">Who We Are</h3>
                            <p className="text-sm dark:text-slate-800">
                                DisasterGuard is an innovative platform committed to enhancing disaster preparedness and response. 
                                Utilizing AI, geospatial analysis, and real-time data, we support Red Cross Rwanda in mitigating risks 
                                and coordinating efficient responses to natural disasters and emergencies.
                            </p>
                        </div>
                        <div className="p-4 border-l-4 border-gray-700">
                            <h3 className="text-2xl font-semibold mb-2 text-black">Vision</h3>
                            <p className="text-sm dark:text-slate-800">
                                Our vision is to transform disaster management through intelligent technology, fostering resilient 
                                communities that are better prepared for emergencies. We strive to be a leader in disaster risk 
                                reduction and response coordination.
                            </p>
                        </div>
                        <div className="p-4 border-l-4 border-gray-700">
                            <h3 className="text-2xl font-semibold mb-2 text-black">Mission</h3>
                            <p className="text-sm dark:text-slate-800">
                                Our mission is to empower humanitarian organizations, government agencies, and communities with 
                                tools and insights that enhance disaster preparedness and response. By leveraging cutting-edge 
                                technology, we aim to save lives and reduce the impact of disasters.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </section>
    );
}

export default About;
