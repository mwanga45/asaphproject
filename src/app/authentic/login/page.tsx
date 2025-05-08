
'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
// import Link from 'next/link'
import './login.css'

interface LoginForm {
  email: string
  password: string
}

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Login:', form)
  
  }

  return (
    <div className="container">
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
        <button type="submit" className="btn">
          Sign In
        </button>
        <p className="signup-text">
          Don’t have an account?{' '}
          {/* <Link href="../registration">
            <a className="signup-link">Register</a>
          </Link> */}
        </p>
      </form>
    </div>
  )
}

export default Login
