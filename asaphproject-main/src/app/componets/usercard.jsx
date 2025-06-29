import React from 'react'
import "./usercard.css"
export default function Usercard({ username }) {

  return (
    <div className='usrmain-container'>
      <div className='usrRole'>
        <div className='rolename' >
            <p>Your Details</p>
        </div>
        <div className='usrdetails'>
            <div className='usrImgcontainer'>
                <img src="../favicon.ico" alt=""  />
            </div>
            <div className='usrnamecontainer'>
                <p style={{color:"grey", fontWeight:"bolder"}}>Name</p>
                <p style={{color:"grey", fontWeight:"800" , fontFamily:"sans-serif"}}>{username ? username : "Unknown User"}</p>
            </div>
            <div className='usrphonecontainer'>
                <p style={{color:"grey", fontWeight:"bolder"}}>Phone</p>
                <p style={{color:"grey", fontWeight:"800"}}>0744010257</p>
            </div>
            <div className='usremailcontainer'>
                <p style={{color:"grey", fontWeight:"bolder"}}>Email</p>
                <p style={{color:"grey", fontWeight:"800"}}>AsaphFranklin@gmail.com</p>
            </div>
        </div>
      </div>
    </div>
  )
}
