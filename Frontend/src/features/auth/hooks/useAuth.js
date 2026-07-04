import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            return data
        } catch (err) {
            console.error("Login Error:", err)
        } finally {
            setLoading(false)
        }
    }

    // 🚀 FIXED: Register handler ab dynamic token/OTP responses return karega
    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            
            // Agar backend se direct login ho raha hota tabhi setUser karte, 
            // par ab hme OTP step par jana hai isliye direct context set nahi karenge.
            if (data && data.user && !data.otpSent) {
                setUser(data.user)
            }
            
            // 💥 Sabse zaroori: Response data return karna taaki LoginSignup.jsx use read kare
            return data
        } catch (err) {
            console.error("Registration Error:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            console.error("Logout Error:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                setUser(data.user)
            } catch (err) { 
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        getAndSetUser()
    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}