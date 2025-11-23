// client/src/pages/Project.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/api'
import CommentList from '../components/CommentList'
import { useAuth } from '../context/AuthContext'

export default function Project() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [comments, setComments] = useState([])
  const { user } = useAuth()
  const nav = useNavigate()

  // load project + comments
  const load = async () => {
    try {
      const res = await api.get(`/projects/${id}`)
      setProject(res.data.project || res.data)
      const c = await api.get(`/comments/project/${id}`)
      setComments(c.data.comments || c.data)
    } catch (err) {
      console.error('load err', err)
      if (err?.response?.status === 401) nav('/login')
    }
  }

  useEffect(() => {
    if (!id) return
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleAddComment = async (text) => {
    try {
      await api.post('/comments', { projectId: id, text })
      await load()
    } catch (err) {
      console.error('add comment err', err)
      if (err?.response?.status === 401) nav('/login')
    }
  }

  const toggleFav = async () => {
    try {
      await api.post(`/projects/${id}/favorite`)
      await load()
    } catch (err) {
      console.error('toggle fav err', err)
      if (err?.response?.status === 401) nav('/login')
    }
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
          Loading project…
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header + back link */}
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <Link
            to="/"
            className="rounded-full border border-slate-200 px-3 py-1 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            ← Back to projects
          </Link>
          <span>
            Created {new Date(project.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {project.title}
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                By{' '}
                {project.author?.displayName ||
                  project.author?.uid ||
                  'Unknown'}
              </p>

              {/* Tags */}
              {project.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tags.map((t, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                {project.description}
              </div>

              {/* Links */}
              {(project.githubLink || project.liveDemo) && (
                <div className="mt-5 flex flex-wrap gap-3">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      GitHub
                    </a>
                  )}
                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              )}
            </section>

            {/* Comments */}
            <CommentList comments={comments} onAdd={handleAddComment} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Favorites
                  </div>
                  <div className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {project.favorites?.length || 0}
                  </div>
                </div>

                <button
                  onClick={toggleFav}
                  className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  {project.favorites?.includes(user?.uid)
                    ? 'Unfavorite'
                    : 'Favorite'}
                </button>
              </div>

              {user?.uid === project.author?.uid && (
  <div className="mt-4 flex gap-2">
    <Link
      to={`/edit/${project._id}`}
      className="inline-flex items-center rounded-lg bg-yellow-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-yellow-500"
    >
      Edit
    </Link>

    <button
      onClick={async () => {
        if (!window.confirm("Are you sure you want to delete this project?"))
          return;
        try {
          await api.delete(`/projects/${project._id}`);
          alert("Project deleted successfully!");
          nav(`/profile/${user.uid}`);
        } catch (err) {
          console.error(err);
          alert("Delete failed");
        }
      }}
      className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500"
    >
      Delete
    </button>
  </div>
)}

            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
