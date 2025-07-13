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
      <div style={{
        textAlign: 'center',
        margin: '2.5rem auto 1.5rem auto',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '1.2rem',
        padding: '1.5rem 1rem 1.2rem 1rem',
        maxWidth: 600,
        boxShadow: '0 2px 16px rgba(26,115,232,0.10)',
        color: '#fff',
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 900,
          letterSpacing: '1.5px',
          marginBottom: 10,
          color: '#fff',
          textShadow: '0 2px 8px rgba(26,115,232,0.18)'
        }}>
          Medic Appointment Portal
        </h1>
        <p style={{
          fontSize: '1.18rem',
          color: '#e3e8f0',
          fontWeight: 500,
          margin: 0,
          letterSpacing: '0.2px'
        }}>
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
          <p style={{ fontSize: 20 }}>
            Contact
          </p>
          <p style={{color:'blue'}}>0744010257</p>
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
