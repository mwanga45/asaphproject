'use client'
import { useState, ChangeEvent, FormEvent } from 'react'
import axios from 'axios'
import { apiURL } from '@/app/utils/Urlport'
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify'
import './login.css'



interface LoginForm {
  email: string
  password: string
}

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
  const handleSubmit =async(e: FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    try{

      const res = await axios.post(apiURL+'api/service/login',form,{validateStatus:()=> true})
      switch(res.status){
        case 200:
          toast.success(res.data.message)
          const  token =  res.data.token
          console.log(token)
          localStorage.setItem("userToken", token)
          window.location.href ='/home'
          break
        case 400:
          toast.error(res.data.message || 'Unexpect Error or Network Error')
          break
        case 500:
          toast.error(res.data.message|| 'Something went wrong or Network Error') 
        break
        default:
          toast.error('Unexpected Status'+ res.status) 
          break
      }
    }catch(err){
      console.error("Something went wrong ", err)
      return toast.error('Network Error')
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }


  return (
    <div className="container">
      <ToastContainer/>
      <form className="form" onSubmit={handleSubmit}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="1" d="M0,160L34.3,138.7C68.6,117,137,75,206,85.3C274.3,96,343,160,411,197.3C480,235,549,245,617,234.7C685.7,224,754,192,823,170.7C891.4,149,960,139,1029,160C1097.1,181,1166,235,1234,229.3C1302.9,224,1371,160,1406,128L1440,96L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path></svg>
        <h2 className="title">Login</h2>
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
        <button type="submit" className="btn" >
          Sign In
        </button>
        <p className="signup-text">
          Don’t have an account?
          <Link href='/authentic/registration'>Go to Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
