// client/src/pages/Home.jsx
import React, { useEffect, useState, useRef } from 'react'
import api from '../api/api'
import ProjectCard from '../components/ProjectCard'

const LIMIT = 9

export default function Home() {
  const [projects, setProjects] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const debounceRef = useRef(null)

  const fetchProjects = async (p = 1, q = '') => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(
        `/projects?page=${p}&limit=${LIMIT}&q=${encodeURIComponent(q)}`
      )
      const data = res.data
      setProjects(data.projects || [])
      setTotal(Number(data.total ?? (data.projects ? data.projects.length : 0)))
      setPage(p)
    } catch (err) {
      console.error('fetchProjects err', err)
      setError(
        err?.response?.data?.message || err.message || 'Failed to load'
      )
    } finally {
      setLoading(false)
    }
  }

  // initial load
  useEffect(() => {
    fetchProjects(1, query)
    // eslint-disable-next-line
  }, [])

  // debounce search input
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchProjects(1, query)
    }, 350)
    return () => clearTimeout(debounceRef.current)
    // eslint-disable-next-line
  }, [query])

  const next = () => {
    if (projects.length === 0) return
    if (page * LIMIT >= total) return
    fetchProjects(page + 1, query)
  }

  const prev = () => {
    if (page <= 1) return
    fetchProjects(page - 1, query)
  }

  return (
    <main className="min-h-screen  bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 ">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Top bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ̰">
          <div>
            <h1 className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
              Explore Projects
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Peer-contributed projects — learn, reuse and collaborate.
            </p>
          </div>

          <div className="w-full max-w-xs">
            <input
              placeholder="Search by title, description or tag…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search projects"
              className="w-full rounded-full border px-4 py-2 text-sm shadow-sm
border-slate-300 bg-white text-slate-900 placeholder:text-slate-400
focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40
dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"

            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-red-500/40 bg-red-900/40 px-4 py-3 text-sm text-red-100">
            <div>
              <div className="font-semibold">Error</div>
              <div className="text-xs text-red-200/80">{error}</div>
            </div>
            <button
              className="rounded-full border border-red-400/60 bg-red-900/60 px-3 py-1 text-xs text-red-50 hover:bg-red-800 disabled:opacity-60"
              onClick={() => fetchProjects(page, query)}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm"
              >
                <div className="h-4 w-2/3 rounded bg-slate-700" />
                <div className="mt-3 h-3 w-11/12 rounded bg-slate-800" />
                <div className="mt-2 h-3 w-10/12 rounded bg-slate-800" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-500 bg-slate-500 p-6 text-sm text-violet-100">
                  No projects found
                </div>
              ) : (
                projects.map((p) => <ProjectCard key={p._id} project={p} />)
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
              <div>
                Showing {Math.min(page * LIMIT, total)} of {total}
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={prev}
                  disabled={page <= 1}
                >
                  Prev
                </button>
                <button
                  className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={next}
                  disabled={page * LIMIT >= total}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
