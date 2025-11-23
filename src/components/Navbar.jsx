import React from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { Moon, Sun } from "lucide-react"

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  const isActive = (path) =>
    location.pathname === path
      ? "text-indigo-600 dark:text-indigo-400 font-semibold"
      : "text-slate-600 dark:text-slate-300"

  return (
    <header className="sticky top-0  z-20 bg-slate-200/70 dark:bg-slate-800/70 backdrop-blur-md border-b border-slate-300 dark:border-slate-700 shadow-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 ">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 select-none">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 shadow-[3px_3px_6px_rgba(0,0,0,0.2),-3px_-3px_6px_rgba(255,255,255,0.7)] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.5),-3px_-3px_6px_rgba(255,255,255,0.05)] text-xs font-bold text-indigo-600 dark:text-indigo-400">
            PP
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Peer Project Hub
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4 text-sm">
          <Link className={isActive("/")} to="/">
            Home
          </Link>

          {user ? (
            <Link
              to={`/profile/${user.uid}`}
              className="text-xs max-w-[140px] truncate"
            >
              {user.displayName || 'Profile'}
            </Link>
          ) : (
            <>
              <Link className={isActive("/login")} to="/login">
                Login
              </Link>
              <Link className={isActive("/signup")} to="/signup">
                Sign up
              </Link>
            </>
          )}

          <Link
            to="/create"
            className="rounded-xl bg-slate-100 dark:bg-slate-700 px-3 py-1.5 text-xs font-medium shadow-[3px_3px_6px_rgba(0,0,0,0.2),-3px_-3px_6px_rgba(255,255,255,0.7)] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.5),-3px_-3px_6px_rgba(255,255,255,0.05)] hover:scale-[1.05] transition"
          >
            New Project
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 shadow-[3px_3px_6px_rgba(0,0,0,0.2),-3px_-3px_6px_rgba(255,255,255,0.7)] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.5),-3px_-3px_6px_rgba(255,255,255,0.05)] hover:scale-110 transition"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user && (
            <button
              onClick={() => {
                logout()
                nav("/login")
              }}
              className="text-xs text-red-600 hover:text-red-400 transition"
            >
              Logout
            </button>
          )}
        </nav>

      </div>
    </header>
  )
}
