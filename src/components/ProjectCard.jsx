// client/src/components/ProjectCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  const excerpt = project.description
    ? project.description.length > 260
      ? project.description.slice(0, 260) + '…'
      : project.description
    : ''

  const created = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : ''

  return (
    <Link
      to={`/projects/${project._id}`}
      className="group block"
    >
      <article
        className="flex min-h-[180px] flex-col justify-between rounded-2xl border border-slate-300 bg-white p-4 shadow-sm transition
        hover:-translate-y-0.5 hover:shadow-md group-hover:border-indigo-500
        dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Title + meta */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
            {project.title}
          </h3>

          <div className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
            {project.author?.displayName || project.author?.uid}
            {created && <> • {created}</>}
          </div>

          <p className="mt-3 text-sm text-slate-700 whitespace-pre-wrap line-clamp-3 dark:text-slate-300">
            {excerpt}
          </p>
        </div>

        {/* Tags + View pill */}
        <div className="mt-4 flex items-center justify-between">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {(project.tags || []).slice(0, 4).map((t, i) => (
              <span
                key={i}
                className="rounded-full border border-slate-300 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700
                dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-300"
              >
                #{t}
              </span>
            ))}
          </div>

          {/* View label (still looks like button) */}
          <span
            className="rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-medium text-white shadow
            group-hover:bg-indigo-500
            dark:bg-indigo-500 dark:group-hover:bg-indigo-400"
          >
            View
          </span>
        </div>
      </article>
    </Link>
  )
}
