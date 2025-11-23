import React, { useState } from 'react'

export default function ProjectForm({ initial = {}, onSubmit = async () => {} }) {
  const [title, setTitle] = useState(initial.title || '')
  const [description, setDescription] = useState(initial.description || '')
  const [tags, setTags] = useState((initial.tags || []).join(', '))
  const [githubLink, setGithubLink] = useState(initial.githubLink || '')
  const [liveDemo, setLiveDemo] = useState(initial.liveDemo || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Title required')
      return
    }

    setLoading(true)
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        githubLink: githubLink.trim() || undefined,
        liveDemo: liveDemo.trim() || undefined,
        updatedAt: new Date().toISOString(),
      }
      await onSubmit(payload)
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Submit failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* error */}
      {error && (
        <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-100 dark:border-red-500/70">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          placeholder="Name of your project"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
          Description
        </label>
        <textarea
          rows="6"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          placeholder="Explain what the project does and how to use it"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Tags */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
          Tags (comma separated)
        </label>
        <input
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
          placeholder="react, node, ml…"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      {/* Links */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
            GitHub Repo URL
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
            placeholder="https://github.com/user/repo"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
            Live Demo URL (optional)
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
            placeholder="https://yourapp.com"
            value={liveDemo}
            onChange={(e) => setLiveDemo(e.target.value)}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-2 text-right">
        <button
          disabled={loading}
          className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          {loading ? 'Submitting…' : 'Submit'}
        </button>
      </div>
    </form>
  )
}
