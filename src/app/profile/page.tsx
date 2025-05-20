"use client";
import React from "react";
import Usercard from "../componets/usercard";
import Btn from "../componets/btn";
import Navbar from "../componets/navigation";
import './profile.css'
function Profile() {
  return (
    <div className="profile-container">
      <Navbar />
      <div>
        <Usercard />
      </div>
      <div className="slot-desk">
        <div><Btn name="booking"/></div>
        <div><Btn name="booking"/></div>
        <div><Btn name="booking"/></div>
        <div><Btn name="booking"/></div>
        <div><Btn name="booking"/></div>  
      </div>
      <div className="info-container">
        <div className="info-space"></div>
      </div>
    </div>
  );
}

export default Profile;
