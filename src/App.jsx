import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Project from './pages/Project'
import Create from './pages/Create'
import Edit from './pages/Edit'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'


function RequireAuth({ children }) {
const { user, loading } = useAuth()
if (loading) return <div className="container center">Loading...</div>
if (!user) return <Navigate to="/login" replace />
return children
}


export default function App() {
return (
<AuthProvider>
<div>
<Navbar />
<main style={{paddingTop:18}}>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/projects/:id" element={<Project />} />
<Route path="/create" element={<RequireAuth><Create /></RequireAuth>} />
<Route path="/edit/:id" element={<RequireAuth><Edit /></RequireAuth>} />
<Route path="/profile/:uid" element={<Profile />} />
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
</Routes>
</main>
</div>
</AuthProvider>
)
}