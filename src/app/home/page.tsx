"use client";
import React from "react";
import Navbar from "../componets/navigation";
import Infocard from "../componets/infocard";
import { FaPhone } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import Slideshow from "../componets/slide"
import "./home.css";

function Home() {
  const  slides = [
  'https://images.unsplash.com/photo-1588776814314-d2c099baf4f3',
  'https://images.unsplash.com/photo-1604014237339-01b5f4a57a44',
  'https://images.unsplash.com/photo-1588776814457-1d1e6e8e1f43',
  'https://images.unsplash.com/photo-1600959907703-e6041e6b8f3c',
  'https://images.unsplash.com/photo-1580281657527-47d7d99c37ce'
  
  ]
  return (

    <div className="hm-container">
      <Navbar />
      <div className="container-invitation">
        <p className="invitation">Hi name Welcome Our MedicCare service </p>
      </div>
      <div className="image-slide">
       <Slideshow slides={slides}/>
      </div>
      <div className="info-card">
        <Infocard />
        <Infocard />
        <Infocard />
      </div>
      <div className="footer">
        <div>
            <FaPhone />
          <p style={{ fontSize: 20 }}>
            Contact
          </p>
          <p>0744010257</p>
        </div>
        <div>
              <FaInstagramSquare />
          <p style={{ fontSize: 20 }}>
            Instagram
          </p>
          <p>
            <a
              href="https://www.instagram.com/your_username"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit us on Instagram
            </a>
          </p>
        </div>
        <div>
            <IoLogoWhatsapp />
          <p style={{ fontSize: 20 }}>
            WhatsApp
          </p>
          <p>
            <a
              href="https://wa.me/15551234567?text=Hello%2C%20I%20have%20a%20question%20about%20your%20services"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp
            </a>
          </p>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default Home;
