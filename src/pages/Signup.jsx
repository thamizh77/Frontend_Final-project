// client/src/pages/Signup.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const nav = useNavigate()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)
    try {
      await signup(email, password, displayName)
      nav('/')
    } catch (err) {
      console.error('signup err', err)
      const code = err?.code || err?.message || 'UNKNOWN_ERROR'

      if (code.includes('auth/email-already-in-use')) {
        setErrorMsg('Email already in use. Try logging in.')
      } else if (code.includes('auth/invalid-email')) {
        setErrorMsg('Invalid email address.')
      } else if (code.includes('auth/weak-password')) {
        setErrorMsg('Password too weak (min 6 chars).')
      } else {
        setErrorMsg(err.message || 'Signup failed.')
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
            Create account
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Join Peer Project Hub and start sharing your work.
          </p>

          <form
            className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
            onSubmit={submit}
          >
            {errorMsg && (
              <div className="rounded-lg border border-red-500/70 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-100">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Display name
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

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
              {loading ? 'Creating…' : 'Create account'}
            </button>

            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <span>Already have an account?</span>
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
