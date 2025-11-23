// client/src/pages/Login.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)
    try {
      await login(email, password)
      nav('/')
    } catch (err) {
      const code = err?.code || err?.message || ''

      if (
        code.includes('auth/invalid-credential') ||
        code.includes('auth/wrong-password')
      ) {
        setErrorMsg('Incorrect email or password.')
      } else if (code.includes('auth/user-not-found')) {
        setErrorMsg('No account with this email.')
      } else {
        console.error('Login error:', err)
        setErrorMsg('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-md px-4 pt-10 pb-16">
        <div className="w-full">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Login
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Welcome back! Sign in to continue exploring projects.
          </p>

          <form
            className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
            onSubmit={submit}
          >
            {errorMsg && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Email
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Password
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              {loading ? 'Signing in…' : 'Login'}
            </button>

            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span>New user?</span>
              <Link
                to="/signup"
                className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Create account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
