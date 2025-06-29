'use client'

import React , {useEffect}from "react";
import "./landing.css";
import { FaStarOfLife } from "react-icons/fa6";

export default function Landingpage() {

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href='./authentic/login'
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="main-container">
       <FaStarOfLife color="green" size={80}/>
      <h1>Welcome to our Name of Site</h1>
      <p>For Better and Quality Service</p>
    </div>
  );
}
