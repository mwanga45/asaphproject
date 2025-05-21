"use client";
import React from "react";
import Navbar from "../componets/navigation";
// import Link from 'next/link'
import "./booking.css";
function Booking() {
  const Dropdown = [
    { id: 1, servicename: "General Check" },
    { id: 2, servicename: "Malaria" },
    { id: 3, servicename: "Eye Clinic" },
    { id: 4, servicename: "Skin Clinic" },
  ];
  return (
    <div className="mainbk-container">
      <Navbar />
      <div className="bk-container">
        <div className="bk-title">
          <p className="title-content"> Welcome to Our Booking </p>
        </div>
        <div className="ServiceListContainer">
          <form>
            <select name="" id="" className="service-ls">
              <option value="">--Select Service--</option>
              {Dropdown.map((service) => (
                <option value="id" key={service.id}>
                  {service.servicename}
                </option>
              ))}
            </select>
            <button className="bk-btn">Get Slot!</button>
          </form>
        </div>
        <div className="resultsheet"></div>
        <div className="bookingsheetcointainer"></div>
      </div>
    </div>
  );
}

export default Booking;
