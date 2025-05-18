"use client"
import React from 'react'
import Navbar from "../componets/navigation"
import Infocard from '../componets/infocard'
import './home.css'

function Home() {
  return (
    <div className='hm-container'>
        <Navbar/>
        <div className='container-invitation'>
        <p className='invitation'>Hi name  Welcome Our MedicCare service   </p>
        </div>
        <div className='image-slide'>
        </div>
        <div className='info-card'>
             <Infocard/>
             <Infocard/>
             <Infocard/>
        </div>
        <div></div>
        <div></div>
      
    </div>
  )
}

export default Home
