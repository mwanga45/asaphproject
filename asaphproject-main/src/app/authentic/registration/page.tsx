
'use client'
import { useState, ChangeEvent, FormEvent } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { apiURL } from '@/app/utils/Urlport'
import { ToastContainer,toast } from 'react-toastify'

import './register.css'

interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  address: string
}

const Register: React.FC = () => {
  const [form, setForm] = useState<RegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  })
 const validatePhone= (phone:string)=>{
  const regphone2 = /^(?:0|\+255)7\d{8}$/;
  return regphone2.test(phone)
 }
 const validateEmail = (email:string)=>{
    const regemail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return regemail.test(String(email).toLowerCase());
 }
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    };
    if (!validatePhone(form.phone)){
      toast.error("Invalid Phone Number")
    };
    if (!validateEmail(form.email)){
      toast.error("Invalid Email")
    }
     
    try{
      const res = await axios.post(apiURL+"api/service/register", form, {validateStatus:()=> true})
      switch(res.status){
        case 201 :
          toast.success(res.data.message)
          window.location.href= "/authentic/login"
          break
        case 400:
          toast.error(res.data.message)
          break
        case 500:
          toast.error(res.data.message)
          break
        default:
          toast.error(res.status)
          break
      }
    }catch(err){
      console.error("Something went wrong here", err)
      return alert("Unexpected Error or Network Error")

    }
    
  }

  return (
    <div className="container">
    <ToastContainer/>
      <form className="form" onSubmit={handleSubmit}>
        <h2 className="title">Register</h2>

        <label className="field">
          <span className="label-text">Username</span>
          <input
            type="text"
            name="username"
            className="input"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span className="label-text">Email</span>
          <input
            type="email"
            name="email"
            className="input"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span className="label-text">Password</span>
          <input
            type="password"
            name="password"
            className="input"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span className="label-text">Confirm Password</span>
          <input
            type="password"
            name="confirmPassword"
            className="input"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span className="label-text">Phone</span>
          <input
            type="tel"
            name="phone"
            className="input"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span className="label-text">Home Address</span>
          <textarea
            name="address"
            className="input textarea"
            value={form.address}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="btn">
          Register
        </button>

        <p className="signup-text">
          Already have an account?{' '}
          <Link href="/authentic/login">
            Go to Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Register