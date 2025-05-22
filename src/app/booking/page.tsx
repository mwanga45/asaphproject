"use client";
import React,{useEffect, useState} from "react";
import Navbar from "../componets/navigation";
import { apiURL } from "../utils/Urlport";
import { ToastContainer,toast } from "react-toastify";
import "./booking.css";
import axios from "axios";
type service = {
  id: number,
  servicename:string,
  duration_minutes:string
  fee:string
}
const  Booking:React.FC =()=> {
  const [services, setservices]= useState<service[]>([])
  const handleService = async()=>{
    try{
      const res =  await axios.get(apiURL+"api/service/profile/seviceAvailable")
      switch(res.status){
        case 200:
          toast.success(res.data.message)
          const serv :service[] =res.data.rows
          setservices(serv)
          console.log(services)
          break
        case 400:
          toast.error("Something went wrong or Token is been Expire")
          break
        case 500:
          toast.error("Internal Server Error ")
          break
          default:
            toast.error("Unexpected Status"+ res.status)
      }
    }catch(err){
      console.error("Something went wrong", err)
      return  alert("Internal Server Error")
    }
  }
  useEffect(() => {
    handleService();
  },[]);

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
            <select name="service" id="service" className="service-ls">
              <option value="">--Select Service--</option>
                   {services.map((service) => (
                <option value={service.id} key={service.id}>
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
