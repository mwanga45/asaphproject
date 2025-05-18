"use client";
import React from "react";
import Navbar from "../componets/navigation";
import Infocard from "../componets/infocard";
import { FaPhone } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import "./home.css";

function Home() {
  return (
    <div className="hm-container">
      <Navbar />
      <div className="container-invitation">
        <p className="invitation">Hi name Welcome Our MedicCare service </p>
      </div>
      <div className="image-slide"></div>
      <div className="info-card">
        <Infocard />
        <Infocard />
        <Infocard />
      </div>
      <div className="footer">
        <div>
          <p style={{fontSize:20}}><FaPhone/>Contact</p>
          <p>0744010257</p>
        </div>
        <div>
          <p style={{fontSize:20}}><FaInstagramSquare/>Instagram</p>
          <p><a href="https://www.instagram.com/your_username" target="_blank" rel="noopener noreferrer">
  Visit us on Instagram
</a>
</p>
        </div>
        <div>
          <p style={{fontSize:20}}><IoLogoWhatsapp/>WhatsApp</p>
          <p><a
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
