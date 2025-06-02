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
          alert(res.data.message || 'Unexpect Error or Network Error')
          break
        case 500:
          alert(res.data.message|| 'Something went wrong or Network Error') 
        break
        default:
          alert('Unexpected Status'+ res.status) 
          break
      }
    }catch(err){
      console.error("Something went wrong ", err)
      return alert('Network Error')
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
