import React from 'react'
import "./usercard.css"


export default function Usercard(role) {

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
                <p>Name</p>
                <p>Asaph Franklin</p>
            </div>
            <div className='usrphonecontainer'>
                <p>Phone</p>
                <p>0744010257</p>
            </div>
            <div className='usremailcontainer'>
                <p>Email</p>
                <p>AsaphFranklin@gmail.com</p>
            </div>
        </div>
      </div>
    </div>
  )
}
