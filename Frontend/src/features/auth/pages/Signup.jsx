import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { useNavigate } from 'react-router'

const C = {
  pink:       '#9333ea',
  pinkLight:  '#2d1254',
  pinkMid:    '#c026d3',
  glow:       '#c026d3',
  bg:         '#07040e',
  cardBg:     '#0e0a1a',
  cardBorder: '#2d1254',
  text:       '#f5f0ff',
  muted:      '#8878a8',
  sub:        '#d8b4fe',
}

const Register = () => {
  const { register, loading } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!username || !email || !password) return
    await register({ username, email, password })
  }

  const inputStyle = {
    width: '100%',
    background: C.cardBg,
    border: `1px solid ${C.cardBorder}`,
    borderRadius: '12px',
    padding: '14px 16px',
    fontSize: '14.5px',
    color: C.text,
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
  }

  const handleFocus = (e) => {
    e.target.style.borderColor = C.pink
    e.target.style.boxShadow = `0 0 16px ${C.pink}33`
    e.target.style.background = '#120c24'
  }

  const handleBlur = (e) => {
    e.target.style.borderColor = C.cardBorder
    e.target.style.boxShadow = 'none'
    e.target.style.background = C.cardBg
  }

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'inherit' }}>
      <style>{`* { box-sizing: border-box; }`}</style>

      <div style={{ background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '20px', padding: '40px', maxWidth: '440px', width: '100%', boxShadow: `0 8px 32px rgba(7, 4, 14, 0.8)` }}>
        
        {/* Clean Logo Header Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', justifyContent: 'center' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#fff' }}>P</div>
          <span style={{ fontSize: '20px', fontWeight: 800, background: `linear-gradient(135deg, #ffffff 30%, ${C.sub} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.5px' }}>Preply</span>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: C.text, margin: 0 }}>Create your <span style={{ color: C.sub }}>account</span></h2>
          <p style={{ fontSize: '13.5px', color: C.muted, margin: '6px 0 0' }}>Sign up to get a personalized interview strategy in minutes.</p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13.5px', fontWeight: 600, color: C.text }}>Username</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13.5px', fontWeight: 600, color: C.text }}>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email address" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13.5px', fontWeight: 600, color: C.text }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: C.muted, cursor: 'pointer', display: 'flex' }}>
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </span>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', marginTop: '8px', padding: '14px', borderRadius: '12px', background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`, color: 'white', border: 'none', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease', boxShadow: `0 4px 16px ${C.glow}33` }}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>

        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: C.muted }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={{ color: C.sub, fontWeight: 600, cursor: 'pointer' }}>
            Login
          </span>
        </div>

      </div>
    </div>
  )
}

export default Register