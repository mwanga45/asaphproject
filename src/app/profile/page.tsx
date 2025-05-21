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
        <div><Btn name="Bk History"/></div>
        <div><Btn name="Doctors Result"/></div>
        <div><Btn name="Medic info"/></div> 
      </div>
      <div className="info-container">
        <div className="info-space">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque cum mollitia, enim magni nemo corporis recusandae ab voluptates obcaecati dolorem accusamus sequi quisquam ex, totam officiis non maxime rerum delectus?</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque cum mollitia, enim magni nemo corporis recusandae ab voluptates obcaecati dolorem accusamus sequi quisquam ex, totam officiis non maxime rerum delectus?</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque cum mollitia, enim magni nemo corporis recusandae ab voluptates obcaecati dolorem accusamus sequi quisquam ex, totam officiis non maxime rerum delectus?</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
