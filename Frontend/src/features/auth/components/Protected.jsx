import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import React, { useEffect } from 'react'

const Protected = ({ children }) => {
    const { loading, user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        // Agar auth ka check chalna band ho gaya hai aur user abhi bhi nahi mila, toh direct login par dhakel do
        if (!loading && !user) {
            navigate('/login', { replace: true })
        }
    }, [loading, user, navigate])

    // Jab tak backend se login status verify ho raha hai, tab tak screen par kuch mat dikhao
    if (loading) {
        return (
            <main style={{ minHeight: '100vh', background: '#07040e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1>Loading...</h1>
            </main>
        )
    }

    // Agar user logged in hai, tabhi dashboard/children page dikhao, nahi toh blank rakho jab tak redirect na ho
    return user ? children : null
}

export default Protected