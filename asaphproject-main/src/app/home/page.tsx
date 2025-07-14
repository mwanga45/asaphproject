"use client";
import React, { useEffect } from "react";
import Navbar from "../componets/navigation";
import Infocard from "../componets/infocard";
import { FaPhone } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import Slideshow from "../componets/slide"
import img1 from '../utils/image/istockphoto-1456035845-612x612.webp';
import img2 from '../utils/image/istockphoto-1935710691-612x612.webp';
import img3 from '../utils/image/istockphoto-2154829989-612x612.webp';
import "./home.css";

function Home() {
const slides = [
  img1.src,
  img2.src,
  img3.src
];

useEffect(()=>{
  const token = localStorage.getItem('userToken')
  console.log("here is token ",token)
}, [])

  return (
    <div className="hm-container">
      <Navbar />
      <div className="home-hero">
        <h1 className="home-title">
          Medic Appointment Portal
        </h1>
        <p className="home-desc">
          Book, manage, and track your medical appointments with ease. Secure, fast, and user-friendly for patients and doctors.
        </p>
      </div>
      <div className="container-invitation">
        <p className="invitation">Welcome! We're glad to have you at MedicCare. Explore our services and take charge of your health journey.</p>
      </div>
      <div className="image-slide">
       <Slideshow slides={slides}/>
      </div>
      <div className="info-card">
        <Infocard text="Easily schedule appointments with top medical professionals at your convenience. Our platform ensures a seamless booking experience for all users." />
        <Infocard text="Stay updated with real-time notifications and reminders for your upcoming appointments. Never miss a visit and manage your health effortlessly." />
        <Infocard text="Your data is secure with us. We prioritize your privacy and provide a safe environment for all your medical scheduling needs." />
      </div>
      <div className="footer">
        <div>
            <FaPhone />
          <p className="footer-label">Contact</p>
          <p style={{color:'#1976d2', fontWeight:600}}>0744010257</p>
        </div>
        <div>
              <FaInstagramSquare />
          <p className="footer-label">Instagram</p>
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
          <p className="footer-label">WhatsApp</p>
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
