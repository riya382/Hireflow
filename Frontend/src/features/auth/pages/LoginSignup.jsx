import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.js'

const C = {
  pink:       '#9333ea',
  pinkLight:  '#2d1254',
  pinkMid:    '#c026d3',
  glow:       '#c026d3',
  bg:         '#07040e',
  cardBg:     '#0e0a1a',
  panelBg:    '#120722',
  cardBorder: '#2d1254',
  text:       '#f5f0ff',
  muted:      '#a294c2', 
  sub:        '#d8b4fe',
}

export default function LoginSignUp() {
  const { handleLogin, handleRegister, loading } = useAuth()
  
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    document.title = "HireFlow - AI Interview Coach"
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    
    try {
      if (isLogin) {
        await handleLogin({ email, password })
        window.location.href = '/'
      } else {
        if (!username) return
        await handleRegister({ username, email, password })
        window.location.href = '/'
      }
    } catch (error) {
      console.error("Auth main issue:", error)
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.04)', 
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '14px 16px', 
    fontSize: '15px',
    color: '#ffffff',
    outline: 'none',
    transition: 'all 0.25s ease',
  }

  const labelStyle = { 
    fontSize: '14px', 
    fontWeight: '600', 
    color: '#bfaedb',
    letterSpacing: '0.3px'
  }

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0', margin: '0', fontFamily: 'sans-serif' }}>

      <style>{`
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        
        .custom-input:focus {
          background: rgba(255, 255, 255, 0.07) !important;
          border-color: ${C.pinkMid} !important;
          box-shadow: 0 0 12px ${C.glow}33 !important;
        }

        .submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 22px ${C.glow}55 !important;
          filter: brightness(1.1);
        }
        .submit-btn:active {
          transform: translateY(1px);
        }
      `}</style>

      {/* Main Framework Card - Full Screen */}
      <div style={{ display: 'flex', width: '100vw', height: '100vh', background: C.cardBg, overflow: 'hidden' }}>

        {/* ================= LEFT PANEL ================= */}
        <div style={{ width: '38%', background: `linear-gradient(135deg, ${C.pinkMid} 0%, ${C.pink} 55%, ${C.pinkLight} 100%)`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 56px' }}>

          {/* New Clean Typography Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ fontSize: '34px', fontWeight: '900', letterSpacing: '-0.8px', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#ffffff' }}>Hire</span>
              <span style={{ color: '#e9d5ff', fontWeight: '300', marginLeft: '2px' }}>flow</span>
            </div>
          </div>

          {/* Core App Tagline */}
          <div style={{ maxWidth: '360px' }}>
            <h1 style={{ fontSize: '38px', fontWeight: '800', color: '#fff', lineHeight: '1.25', margin: '0 0 16px 0' }}>
              Optimize your logic.<br/>Deploy your career.
            </h1>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', margin: 0 }}>
              Parse your experience, optimize your tech stacks, and simulate live technical rounds with AI adaptive interviewing rooms.
            </p>
          </div>

          <div></div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div style={{ width: '62%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: C.cardBg, padding: '40px' }}>

          <div style={{ width: '100%', maxWidth: '380px' }}>

            {/* Heading Context Area */}
            <div style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#fff', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p style={{ fontSize: '15px', color: C.muted, margin: 0, fontWeight: '500' }}>
                {isLogin ? 'Sign in to your account to continue' : 'Sign up for a new account to continue'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%' }}>

              {!isLogin && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={labelStyle}>Username</label>
                  <input type="text" className="custom-input" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} required />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Email address</label>
                <input type="email" className="custom-input" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                  <input type={showPassword ? "text" : "password"} className="custom-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
                  <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', color: C.muted, cursor: 'pointer', display: 'flex', fontSize: '14px', userSelect: 'none', fontWeight: '600' }}>
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px', width: '100%' }}>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                  style={{
                    width: '100%', 
                    padding: '14px 36px',
                    borderRadius: '12px',
                    border: 'none',
                    background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`,
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: `0 4px 16px ${C.glow}33`,
                    opacity: loading ? 0.6 : 1,
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {loading ? '...' : (isLogin ? 'Login' : 'Sign Up')}
                </button>
              </div>

            </form>

            {/* Account Toggle Switches */}
            <div style={{ textAlign: 'center', fontSize: '14px', color: C.muted, marginTop: '28px', fontWeight: '500' }}>
              {isLogin ? (
                <span>Don't have an account? <button type="button" onClick={() => setIsLogin(false)} style={{ background: 'none', border: 'none', color: C.sub, fontWeight: '700', cursor: 'pointer', padding: 0, marginLeft: '4px', fontSize: '14px' }}>Sign Up</button></span>
              ) : (
                <span>Already have an account? <button type="button" onClick={() => setIsLogin(true)} style={{ background: 'none', border: 'none', color: C.sub, fontWeight: '700', cursor: 'pointer', padding: 0, marginLeft: '4px', fontSize: '14px' }}>Login</button></span>
              )}
            </div>

          </div>

        </div>

       </div>
     </div>
  )
}