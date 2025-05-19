'use client'
import React from 'react'
import Usercard from '../componets/usercard'
import Btn from '../componets/btn'
function Profile() {
  return (
    <div className='profile-container'>
        <Usercard/>
        <div className="slot-desk">
         <Btn/>
        </div>
    </div>
  )
}

export default Profile
