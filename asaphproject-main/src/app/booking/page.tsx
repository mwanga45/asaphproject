"use client";
import React, { FormEvent, useEffect, useState } from "react";
import Navbar from "../componets/navigation";
import Bookingcofirmation from "../componets/bookingConfirmation"
import { apiURL } from "../utils/Urlport";
import { ToastContainer, toast } from "react-toastify";
import "./booking.css";
import axios from "axios";
import { IoSearchCircleSharp } from "react-icons/io5";


type service = {
  id: number;
  servicename: string;
  duration_minutes: string;
  fee: string;
};

type selectSv = {
  id: number;
  servicename: string;
  duration_minutes: string;
};

type rowSlotty = {
  doctor_id: number;
  doctorname: string;
  start_time: string;
  end_time: string;
  date: string;
  day_name: string;
};

// Utility function to convert day name to integer (Sunday=0, ..., Saturday=6)
function dayNameToInt(day: string): number {
  switch (day.toLowerCase()) {
    case 'sunday': return 0;
    case 'monday': return 1;
    case 'tuesday': return 2;
    case 'wednesday': return 3;
    case 'thursday': return 4;
    case 'friday': return 5;
    case 'saturday': return 6;
    default: return -1; // invalid
  }
}

// Helper to convert integer back to day name for display
function intToDayName(day: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[day] || '';
}

type booking = {
  doctor_id: number;
  doctorname: string;
  startTime: string;
  endTime: string;
  date: string;
  dayname: number; // now integer
  serviceId: string;
}

const Booking: React.FC = () => {
  const [services, setservices] = useState<service[]>([]);
  const [selectedSv, setselectSv] = useState<selectSv | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [allSlots, setAllSlots] = useState<rowSlotty[]>([]);
  const [rowSlot, setrowSlot] = useState<rowSlotty[]>([]);
  const [isopen, setisopen] = useState<boolean>(false)
  const [searchValue, setsearchValue] = useState<{ search: string }>({
    search: "",
  });
  const [Selectedbooking, setSelectedbooking] = useState<booking[]>([])
  const [bookingLoading, setBookingLoading] = useState(false);

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
          toast.error("Something went wrong or Token has expired");
          break;
        case 404:
          toast.error(res.data.message);
          break;
        case 500:
          toast.error("Internal Server Error");
          break;
        default:
          toast.error("Unexpected Status: " + res.status);
          break;
      }
    } catch (err) {
      console.error("Something went wrong", err);
      alert("Internal Server Error");
    }
  };

  useEffect(() => {
    handleService();
  }, []);


  useEffect(() => {
    const term = searchValue.search.trim().toLowerCase();
    if (term === "") {

      setrowSlot(allSlots);
    } else {
      const filtered = allSlots.filter((s) =>
        s.day_name.toLowerCase().includes(term)
      );
      setrowSlot(filtered);
    }
  }, [searchValue.search, allSlots]);

  const handleonchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setsearchValue((prev) => ({ ...prev, [name]: value }));

  };

  const handleSelectserv = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const numId = Number(id);
    const svc = services.find((s) => s.id === numId);
    if (svc) {
      setselectSv({
        id: svc.id,
        servicename: svc.servicename,
        duration_minutes: svc.duration_minutes,
      });
      setSelectedServiceId(id);
    } else {
      setselectSv(null);
      setSelectedServiceId("");
      setAllSlots([]);
    }
  };
  const handleselected = (slotItem: rowSlotty) => {
    if (
      !selectedSv ||
      !selectedServiceId ||
      !slotItem.doctor_id ||
      !slotItem.doctorname ||
      !slotItem.start_time ||
      !slotItem.end_time ||
      !slotItem.date ||
      !slotItem.day_name
    ) {
      toast.error("Missing booking information. Please select a valid slot and service.");
      return;
    }
    const booked: booking = {
      doctor_id: slotItem.doctor_id,
      doctorname: slotItem.doctorname,
      startTime: slotItem.start_time,
      endTime: slotItem.end_time,
      date: slotItem.date,
      dayname: dayNameToInt(slotItem.day_name), // convert to integer
      serviceId: selectedServiceId,
    };
    setSelectedbooking(() => [booked]);
    setisopen(true);
  };

  const handlebookingRequest = async () => {
    if (!Selectedbooking.length) {
      toast.error("Please choose service you want to book");
      return;
    }
    const b = Selectedbooking[0];
    if (
      !b.doctor_id ||
      !b.doctorname ||
      !b.startTime ||
      !b.endTime ||
      !b.date ||
      !b.dayname ||
      !b.serviceId ||
      b.serviceId === "undefined"
    ) {
      toast.error("Booking data is incomplete. Please select a valid slot and service.");
      return;
    }
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error('please login first');
      return;
    }
    setBookingLoading(true);
    try {
      console.log("Booking payload:", { Selectedbooking });
      const res = await axios.post(apiURL + "api/service/booking/makebooking", { Selectedbooking }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.status === 200) {
        toast.success("successfuly make booking");
        setisopen(false);
        setSelectedbooking([]);
        setBookingLoading(false);
        return;
      }
      toast.error("Something went wrong");
      console.error(res.data.message);
      setisopen(false);
      setSelectedbooking([]);
      setBookingLoading(false);
      return;
    } catch (err) {
      console.error("Something went wrong", err);
      toast.error('Internal server error');
      setisopen(false);
      setSelectedbooking([]);
      setBookingLoading(false);
      return;
    }
  };
  const handlegetslot = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSv) {
      return toast.error("Please select a service first");
    }
    try {
      const respond = await axios.post(
        apiURL + "api/service/booking/getslot",
        selectedSv
      );
      if (respond.status === 200) {
        toast.success("Available slots loaded");
        const result: rowSlotty[] = respond.data.available;
        setAllSlots(result);

      } else if (respond.status === 400) {
        toast.error(respond.data.message);
      } else {
        toast.error("Unexpected response: " + respond.status);
      }
    } catch (err) {
      console.error("Something went wrong", err);
      toast.error("Internal Server Error");
    }
  };

  return (
    <div className="mainbk-container">
      <Navbar />
      <div className="bk-container">
        <ToastContainer />
        <div className="bk-title">
          <p className="title-content">Welcome to Our Booking</p>
        </div>
        <div className="ServiceListContainer">
          <form onSubmit={handlegetslot}>
            <select
              name="service"
              id="service"
              className="service-ls"
              onChange={handleSelectserv}
              defaultValue=""
            >
              <option value="">--Select Service--</option>
              {services.map((service) => (
                <option value={service.id} key={service.id}>
                  {service.servicename}
                </option>
              ))}
            </select>
            <button type="submit" className="bk-btn">
              Get Slot!
            </button>
          </form>
        </div>
        <div className="filter-listbk">
          <div className="search-list">
            <div
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              <input
                type="text"
                id="searchId"
                name="search"
                placeholder="Search for days?"
                onChange={handleonchange}
                value={searchValue.search}
              />
              <IoSearchCircleSharp size={30} color="white" />
            </div>
          </div>
        </div>
        <div className="bookingsheetcointainer">
          {rowSlot.length > 0 ? (
            rowSlot.map((data, idx) => (
              <div className="listSlot-container" key={idx}>
                <div className="imagedkt"></div>
                <div className="dktinfo">
                  <p className="dktname">Dr {data.doctorname}</p>
                  <p className="office stations">Floor No.</p>
                </div>
                <div className="shedkt">
                  <p className="startend">Start at: {data.start_time}</p>
                  <p className="startend">End at: {data.end_time}</p>
                  <p className="daybooking">Day of Week: {data.day_name}</p>
                  <p className="datebooking">Date: {data.date}</p>
                </div>
                <div className="bookbtn-container">
                  <button className="bkbtn" onClick={() => handleselected(data)}>Select</button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", width: "100%" }}>
              {allSlots.length === 0
                ? "No slots fetched yet. Please select a service and click Get Slot!"
                : `No slots match "${searchValue.search}".`}
            </p>
          )}
        </div>
      </div>
      {isopen ? true && (
        <div className="submit-requestbk">
          <Bookingcofirmation 
            dkname={Selectedbooking[0].doctorname} 
            stT={Selectedbooking[0].startTime} 
            endT={Selectedbooking[0].endTime} 
            date={Selectedbooking[0].date} 
            dayWeek={intToDayName(Selectedbooking[0].dayname)}
            servname={selectedSv?.servicename} 
            onclick={bookingLoading ? undefined : handlebookingRequest}
          />
          {bookingLoading && <div style={{textAlign:'center',marginTop:'1rem'}}>Processing booking...</div>}
        </div>
      ) : false
      }
    </div>
  );
};

export default Booking;
