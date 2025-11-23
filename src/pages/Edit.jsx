// client/src/pages/Edit.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProjectForm from '../components/ProjectForm'
import api from '../api/api'

export default function Edit() {
  const { id } = useParams()
  const [initial, setInitial] = useState(null)
  const nav = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/projects/${id}`)
        // supports both { project } or direct project
        setInitial(res.data.project || res.data)
      } catch (err) {
        console.error(err)
      }
    }
    if (id) load()
  }, [id])

  const handleSubmit = async (data) => {
    try {
      await api.put(`/projects/${id}`, data)
      nav(`/projects/${id}`)
    } catch (err) {
      console.error(err)
    }
  }

  if (!initial) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
          Loading project…
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Edit project
        </h2>
        <p className="mt-1 mb-5 text-sm text-slate-500 dark:text-slate-400">
          Update your project details and save changes.
        </p>

        <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <ProjectForm initial={initial} onSubmit={handleSubmit} />
        </div>
      </div>
    </main>
  )
}
