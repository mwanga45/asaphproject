'use client'

import React, { useEffect } from "react";
import "./landing.css";

export default function Landingpage() {

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href='./authentic/login'
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="main-container">
      
      <h1>Welcome to our Name of Site</h1>
      <h2>For Better and Quality Service</h2>
    </div>
  );
}
