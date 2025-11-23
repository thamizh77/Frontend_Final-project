// client/src/pages/Profile.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/api'
import ProjectCard from '../components/ProjectCard'

export default function Profile() {
  const { uid } = useParams()
  const [userData, setUserData] = useState(null)
  const [projects, setProjects] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setError('')
        const res = await api.get(`/users/${uid}`)
        const data = res.data

        // backend shape flexible-aa handle pannrom
        const user = data.user || data.profile || data.userData || data

        setUserData(user)
        setProjects(data.projects || [])
      } catch (err) {
        console.error('profile load err', err)
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load profile'
        setError(msg)
      }
    }

    if (uid) load()
  }, [uid])

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="rounded-xl border border-red-500/60 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        </div>
      </main>
    )
  }

  if (!userData) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
          Loading profile…
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        {/* User card */}
        <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            {userData.displayName || 'User'}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {userData.bio || 'No bio yet.'}
          </p>
        </section>

        {/* Projects section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Projects
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {projects.length} project{projects.length === 1 ? '' : 's'}
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
              No projects published yet.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
