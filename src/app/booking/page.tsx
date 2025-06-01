"use client";
import React, { FormEvent, useEffect, useState } from "react";
import Navbar from "../componets/navigation";
import { apiURL } from "../utils/Urlport";
import { ToastContainer, toast } from "react-toastify";
import "./booking.css";
import axios from "axios";
import Btn from '../componets/btn'

type service = {
  id: number;
  servicename: string;
  duration_minutes: string;
  fee: string;
};
type selectSv = {
  servicename: string,
  duration_minutes: string
};
type rowSlotty = {
  doctor_id: Number,
  doctorname: string,
  start_time: string,
  end_time: string,
  date: string,
  day_name: string

}
const Booking: React.FC = () => {
  const [services, setservices] = useState<service[]>([]);
  const [selectedSv, setselectSv] = useState<selectSv | null>(null)
  const [rowSlot, setrowSlot] = useState<rowSlotty[]>([])
  const handleService = async () => {
    try {
      const res = await axios.get(
        apiURL + "api/service/profile/seviceAvailable"
      );
      switch (res.status) {
        case 200:
          toast.success(res.data.message);
          const serv: service[] = res.data.rows;
          setservices(serv);
          break;
        case 400:
          toast.error("Something went wrong or Token is been Expire");
          break;
        case 404:
          toast.error(res.data.message)
          break
        case 500:
          toast.error("Internal Server Error ");
          break;
        default:
          toast.error("Unexpected Status" + res.status);
          break;
      }
    } catch (err) {
      console.error("Something went wrong", err);
      return alert("Internal Server Error");
    }
  };
  const handleSelectserv = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value)
    const svc = services.find((s) => s.id === id)
    if (svc) {
      setselectSv({
        servicename: svc.servicename,
        duration_minutes: svc.duration_minutes
      })
      console.log(selectedSv)
    } else {
      setselectSv(null)
    }
  }
  const handlegetslot = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSv) {
      return toast.error("Please select target Service")
    }
    try {
      const respond = await axios.post(apiURL + "api/service/booking/getslot", selectedSv)
      if (respond.status === 200) {
        toast.success("Here soon you will see it!")
        const result: rowSlotty[] = respond.data.available
        setrowSlot(result)
        return

      }
      else if (respond.status === 400) {
        return toast.error(respond.data.message)
      } else {
        return toast.error(respond.status)
      }
    } catch (err) {
      console.error("Something went wrong", err)
      toast.error("Internal Server Error")
    }
  }
  useEffect(() => {
    handleService();
  }, []);

  return (
    <div className="mainbk-container">
      <Navbar />
      <div className="bk-container">
        <ToastContainer />
        <div className="bk-title">
          <p className="title-content"> Welcome to Our Booking </p>
        </div>
        <div className="ServiceListContainer">
          <form onSubmit={handlegetslot}>
            <select name="service" id="service" className="service-ls" onChange={handleSelectserv}>
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
        <div className="resultsheet">
         {/* <Btn/> */}
        </div>
        <div className="bookingsheetcointainer">
          {
            rowSlot.map((data:any) => {
              return (
                <div className="listSlot-container" key={data.doctor_id}>
                  <div className="imagedkt"></div>
                  <div className="dktinfo">
                    <p className="dktname">Dr {data.doctorname}</p>
                    <p className="office stations">Floor No.</p>
                  </div>
                  <div className="shedkt">
                    <p className="startend">Start at:{data.start_time}</p>
                    <p className="startend">End at:{data.end_time}</p>
                    <p className="daybooking">DayofWeek: {data.day_name}</p>
                    <p className="datebooking">Date: {data.date}</p>
                  </div>
                  <div className="bookbtn-container">
                    <button className="bkbtn">Select</button>
                  </div>

                </div>
              )
            })
          }


        </div>
      </div>
    </div>
  );
};

export default Booking;
