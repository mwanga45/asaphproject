
'use client'
import { useState, ChangeEvent, FormEvent } from 'react'
import Link from 'next/link'

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    console.log('Register:', form)
    
  }

  return (
    <div className="container">
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