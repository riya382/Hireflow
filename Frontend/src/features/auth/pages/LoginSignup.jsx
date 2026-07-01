import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
// Agar aap react-router-dom use kar rahe hain toh navigation ke liye is line ko uncomment karein:
// import { useNavigate } from 'react-router-dom' 

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
  muted:      '#8878a8',
  sub:        '#d8b4fe',
}

export default function LoginSignUp() {
  // CORRECTED: useAuth se handleLogin aur handleRegister ko sahi naam se nikala
  const { handleLogin, handleRegister, loading } = useAuth()
  
  // const navigate = useNavigate() // Home page bhejane ke liye isko uncomment karein

  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    
    try {
      if (isLogin) {
        // CORRECTED: Sahi function hit hoga ab bina kisi error ke
        await handleLogin({ email, password })
        
        // Login hone ke baad home page bhejne ke liye:
        // navigate('/') 
        // Ya verification ke liye direct browser link change karein:
        window.location.href = '/'
      } else {
        if (!username) return
        await handleRegister({ username, email, password })
        
        // Register hone ke baad automatic home page bhejne ke liye:
        window.location.href = '/'
      }
    } catch (error) {
      console.error("Auth main issue aaya:", error)
    }
  }

  const inputStyle = {
    width: '100%',
    background: '#eef4ff', 
    border: 'none',
    borderRadius: '12px',
    padding: '14px 16px', 
    fontSize: '15px',
    color: '#1a1a2e',
    outline: 'none',
    transition: 'all 0.2s ease',
  }

  const labelStyle = { 
    fontSize: '14px', 
    fontWeight: '700', 
    color: '#ffffff' 
  }

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>

      <style>{`
        * { box-sizing: border-box; }
        .tab-track { position: relative; }
        .tab-curve::before,
        .tab-curve::after {
          content: "";
          position: absolute;
          right: -3px;
          width: 3px;
          height: 3px;
          pointer-events: none;
        }
        .tab-curve::before {
          top: -3px;
          background: radial-gradient(circle at top left, transparent 3px, ${C.cardBg} 4px);
        }
        .tab-curve::after {
          bottom: -3px;
          background: radial-gradient(circle at bottom left, transparent 3px, ${C.cardBg} 4px);
        }
        input:focus {
          box-shadow: 0 0 0 2px ${C.pink};
        }
      `}</style>

      {/* Main Framework Card */}
      <div style={{ display: 'flex', width: '100%', maxWidth: '720px', height: '540px', background: C.cardBg, border: `1px solid ${C.cardBorder}`, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.7)' }}>

        {/* ================= LEFT PANEL ================= */}
        <div style={{ width: '30%', background: `linear-gradient(135deg, ${C.pinkMid} 0%, ${C.pink} 60%, ${C.pinkLight} 100%)`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', position: 'relative' }}>
          <div className="tab-track" style={{ position: 'relative', width: '100%', height: '116px' }}>
            <div
              className="tab-curve"
              style={{
                position: 'absolute', right: 0, width: '55%', height: '46px', background: C.cardBg,
                borderRadius: '20px 0 0 20px', transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
                pointerEvents: 'none', zIndex: 1,
                transform: isLogin ? 'translateY(0px)' : 'translateY(66px)'
              }}
            />
            <button type="button" onClick={() => setIsLogin(true)} style={{ position: 'absolute', top: 0, right: 0, width: '55%', zIndex: 10, padding: '12px 16px', border: 'none', background: 'transparent', textAlign: 'left', fontWeight: '800', fontSize: '12.5px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', color: isLogin ? '#fff' : 'rgba(255,255,255,0.55)' }}>
              Login
            </button>
            <button type="button" onClick={() => setIsLogin(false)} style={{ position: 'absolute', top: '66px', right: 0, width: '55%', zIndex: 10, padding: '12px 16px', border: 'none', background: 'transparent', textAlign: 'left', fontWeight: '800', fontSize: '12.5px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', color: !isLogin ? '#fff' : 'rgba(255,255,255,0.55)' }}>
              Sign Up
            </button>
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div style={{ width: '70%', padding: '40px 50px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: C.cardBg }}>

          {/* Heading Context Area */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', maxWidth: '320px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#fff', margin: '0 0 6px 0' }}>
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>
              {isLogin ? 'Sign in to your account to continue' : 'Register your new account to continue'}
            </p>
          </div>

          {/* Form Processing Track */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '320px', margin: 'auto' }}>

            {!isLogin && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Username</label>
                <input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} required />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={labelStyle}>Email address</label>
              <input type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
                <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#778', cursor: 'pointer', display: 'flex', fontSize: '16px' }}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>
            </div>

            {/* Button Container */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px', width: '100%' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: 'fit-content', 
                  padding: '12px 36px',
                  borderRadius: '12px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`,
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: `0 4px 16px ${C.glow}33`,
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 0.2s'
                }}
              >
                {loading ? '...' : (isLogin ? 'Login' : 'Register')}
              </button>
            </div>

          </form>

          {/* Quick Toggle Redirects Link */}
          <div style={{ textAlign: 'center', fontSize: '13px', color: C.muted }}>
            {isLogin ? (
              <span>Don't have an account? <button type="button" onClick={() => setIsLogin(false)} style={{ background: 'none', border: 'none', color: C.sub, fontWeight: '600', cursor: 'pointer', padding: 0, marginLeft: '4px' }}>Sign Up</button></span>
            ) : (
              <span>Already have an account? <button type="button" onClick={() => setIsLogin(true)} style={{ background: 'none', border: 'none', color: C.sub, fontWeight: '600', cursor: 'pointer', padding: 0, marginLeft: '4px' }}>Login</button></span>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}