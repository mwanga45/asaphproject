'use client'
import React from 'react'
import './bkcf.css'
import Btn from './btn'

interface bookingconfirmationProps {
  dkname: string;
  stT: string;
  endT: string;
  date: string;
  dayWeek: string;
  servname: string | null | undefined;
  onclick: any
}

const BookingConfirmation: React.FC<bookingconfirmationProps> = ({ dkname, stT, endT, date, dayWeek, servname, onclick })=> {
  return (
    <div className='confcontainaer'>
      <div className='innercf-container'>
        <p className="disciptionCf">doctor-name:{dkname} </p>
        <p className="disciptionCf">starting Time: {stT}</p>
        <p className="disciptionCf">Ending Time: {endT}</p>
        <p className="disciptionCf">date for meet: {date}</p>
        <p className="disciptionCf">day of meet: {dayWeek}</p>
        <p className="disciptionCf"> servicename: {servname}</p>
        <Btn name='confirm Request' onClick={onclick} />
      </div>
    </div>
  )
}

export default BookingConfirmation