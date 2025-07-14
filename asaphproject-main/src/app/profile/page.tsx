"use client";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { apiURL } from "../utils/Urlport";
import Usercard from "../componets/usercard";
import Btn from "../componets/btn";
import Navbar from "../componets/navigation";
import './profile.css'

interface DecodedToken {
  username?: string;
  email?: string;
}

interface Booking {
  id: number;
  doctorname: string;
  servicename: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
}

function BookingRecord({ booking }: { booking: Booking }) {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      background: '#f9f9ff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      <div style={{fontWeight: 'bold', fontSize: 16, marginBottom: 4}}>{booking.servicename}</div>
      <div style={{marginBottom: 4}}>
        <span style={{color: '#555'}}>Doctor:</span> <b>{booking.doctorname}</b>
      </div>
      <div style={{marginBottom: 4}}>
        <span style={{color: '#555'}}>Date:</span> <b>{booking.booking_date}</b>
      </div>
      <div style={{marginBottom: 4}}>
        <span style={{color: '#555'}}>Time:</span> <b>{booking.start_time}</b> - <b>{booking.end_time}</b>
      </div>
      <div>
        <span style={{color: '#555'}}>Status:</span> <span style={{color: booking.status === 'confirmed' ? 'green' : booking.status === 'cancelled' ? 'red' : '#888'}}>{booking.status}</span>
      </div>
    </div>
  );
}

function Profile() {
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showBookings, setShowBookings] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUsername(decoded.username || null);
        setEmail(decoded.email || null);
      } catch (e) {
        setUsername(null);
        setEmail(null);
      }
    }
  }, []);

  const handleShowBookings = () => {
    setShowBookings(true);
    setLoadingBookings(true);
    setBookingsError(null);
    const token = localStorage.getItem("userToken");
    if (token) {
      axios.get(apiURL + "api/service/profile/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setBookings(res.data.bookings || []);
        setLoadingBookings(false);
      })
      .catch(() => {
        setBookings([]);
        setBookingsError("Failed to fetch bookings.");
        setLoadingBookings(false);
      });
    } else {
      setBookings([]);
      setBookingsError("No token found.");
      setLoadingBookings(false);
    }
  };

  return (
    <div className="profile-container">
      <Navbar />
      <div>
        <Usercard username={username} email={email} />
      </div>
      <div className="slot-desk">
        <div><Btn name="Bk History" onClick={handleShowBookings}/></div>
        <div><Btn name="Doctors Result" onClick={() => {}}/></div>
        <div><Btn name="Medic info" onClick={() => {}}/></div> 
      </div>
      <div className="info-container">
        <div className="info-space">
            {showBookings && (
              <>
                <h3>Your Bookings</h3>
                {loadingBookings ? (
                  <p style={{ color: '#888', fontStyle: 'italic', padding: '12px 0' }}>Loading bookings...</p>
                ) : bookingsError ? (
                  <p style={{ color: '#fff', background: '#e74c3c', padding: '10px', borderRadius: 6, fontWeight: 500, margin: '12px 0' }}>{bookingsError}</p>
                ) : bookings.length === 0 ? (
                  <div style={{
                    color: '#444',
                    padding: '12px',
                    borderRadius: 6,
                    fontWeight: 500,
                    margin: '12px 0',
                    textAlign: 'center',
                    letterSpacing: 1
                  }}>
                    No bookings found.
                  </div>
                ) : (
                  <div>
                    {bookings.map(b => (
                      <BookingRecord key={b.id} booking={b} />
                    ))}
                  </div>
                )}
                <hr/>
              </>
            )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
