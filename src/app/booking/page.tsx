"use client";
import React,{useEffect} from "react";
import Navbar from "../componets/navigation";
import { apiURL } from "../utils/Urlport";
import { ToastContainer,toast } from "react-toastify";
// import Link from 'next/link'
import "./booking.css";
import axios from "axios";
function Booking() {
  const handleService = async()=>{
    try{
      const res =  await axios.get(apiURL+"/api/service/serviceAvailable")
      switch(res.status){
        case 200:
          toast.success(res.data.message)
       
      }

    }catch(err){
      console.error("Something went wrong", err)
      return  alert("Internal Server Error")
    }
    

  }
  const Dropdown = [
    { id: 1, servicename: "General Check" },
    { id: 2, servicename: "Malaria" },
    { id: 3, servicename: "Eye Clinic" },
    { id: 4, servicename: "Skin Clinic" },
  ];
  useEffect(()=>{
    handleService()
  })
  return (
    <div className="mainbk-container">
      <Navbar />
      <div className="bk-container">
        <ToastContainer/>
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
