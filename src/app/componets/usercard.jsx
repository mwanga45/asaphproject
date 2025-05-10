import React from 'react'
import "./usercard.css"

export default function Usercard(role) {

  return (
    <div className='usrmain-container'>
      <div className='usrRole'>
        <div >
            <p>User Details</p>
        </div>
        <div className='usrdetails'>
            <div>
                <img src="../favicon.ico" alt=""  />
            </div>
            <div>
                <p>Name</p>
            </div>
            <div>
                <p>Phone</p>
                <p>0744010257</p>
            </div>
            <div>
                <p>Email</p>
                <p>AsaphFranklin@gmail.com</p>
            </div>
        </div>
      </div>
    </div>
  )
}
