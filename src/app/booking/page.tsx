'use client'
import React from 'react'
// import Navbar from '../componets/navigation'
import Link from 'next/link'
function Booking() {
  const Dropdown = [
    {id: 1 , servicename: 'General Check'},
    {id: 2 , servicename: 'Malaria'},
    {id: 3, servicename: 'Eye Clinic'},
    {id: 4 , servicename: 'Skin Clinic'}
    
  ]
  return (
    <div>
      <div className='nav-container'>
         {/* <Navbar/> */}
         <div className="bk-title">
          <p> Welcome to Our Booking <Link href='./help'>Check for Some Guidance</Link></p> 
         </div>
         <div className="ServiceListContainer">
              <form >
                <select name="" id="">
                <option value="">--Select Service--</option>
                {Dropdown.map((service)=>(
                    <option value="id" key={service.id}>{service.servicename}</option>
                ))}
                </select>
                <button>Get Slot!</button>
              </form>
         </div>
      </div>
    </div>
  )
}

export default Booking
