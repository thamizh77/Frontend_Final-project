// client/src/pages/Create.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProjectForm from '../components/ProjectForm'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function Create() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [notice, setNotice] = useState('')

  // 🔥 important part
  const handleSubmit = async (data) => {
    setNotice('')

    // attach logged-in user as author
    const payload = {
      ...data,
      author: user
        ? { uid: user.uid, displayName: user.displayName, email: user.email }
        : undefined,
    }

    try {
      const res = await api.post('/projects', payload)
      const project = res.data?.project ?? res.data
      const id = project?._id ?? project?.id
      if (id) {
        nav(`/projects/${id}`)
      } else {
        setNotice('Created — but response missing id. Check server.')
        nav('/')
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || 'Create failed'
      setNotice(msg)
      console.error('create err', err)
      throw err
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Create project
        </h1>
        <p className="mt-1 mb-5 text-sm text-slate-500 dark:text-slate-400">
          Share your project with the community.
        </p>

        {notice && (
          <div className="mb-4 rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-100 dark:border-red-500/70">
            {notice}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <ProjectForm onSubmit={handleSubmit} />
        </div>

        <div className="mt-6 text-xs text-slate-500 dark:text-slate-400">
          Note: If you are not logged in, projects may be created as guest (dev
          mode).
        </div>
      </div>
    </main>
  )
}
