import React, { useState } from 'react'

export default function CommentList({ comments = [], onAdd }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text.trim())
    setText('')
  }

  return (
    <div className="mt-10">
      <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Comments</h4>

      <ul className="mt-3 space-y-3">
        {comments.map((c) => (
          <li
            key={c._id}
            className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
          >
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {c.authorName || 'Anonymous'}
            </div>

            <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              {c.text}
            </div>

            <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              {new Date(c.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>

      {/* Add comment */}
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Write a comment..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400
          focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40
          dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
        />

        <div className="flex justify-end mt-2">
          <button
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow hover:bg-indigo-500
            disabled:cursor-not-allowed disabled:opacity-50
            dark:bg-indigo-500 dark:hover:bg-indigo-400"
            disabled={!text.trim()}
          >
            Add comment
          </button>
        </div>
      </form>
    </div>
  )
}
