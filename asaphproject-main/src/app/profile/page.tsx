"use client";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Usercard from "../componets/usercard";
import Btn from "../componets/btn";
import Navbar from "../componets/navigation";
import './profile.css'

interface DecodedToken {
  username?: string;
  email?: string;
  
}

function Profile() {
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

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

  return (
    <div className="profile-container">
      <Navbar />
      <div>
        <Usercard username={username} />
      </div>
      <div className="slot-desk">
        <div><Btn name="Bk History" onClick={() => {}}/></div>
        <div><Btn name="Doctors Result" onClick={() => {}}/></div>
        <div><Btn name="Medic info" onClick={() => {}}/></div> 
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
