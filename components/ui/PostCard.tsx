'use client'

import { MapPin, Users, Globe, CheckCircle } from 'lucide-react'
import type { CommunityPost } from '@/lib/types/database'

interface PostCardProps {
  post: CommunityPost
  onPinClick?: (post: CommunityPost) => void
  onResolve?: (id: string) => void
  isOwn?: boolean
}

const TYPE_STYLES = {
  ask:   { bg: 'bg-amber-50',   border: 'border-amber-200',  text: 'text-amber-700',  label: 'Ask'   },
  offer: { bg: 'bg-teal-50',    border: 'border-teal-200',   text: 'text-teal-700',   label: 'Offer' },
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins  < 60)  return `${mins}m ago`
  if (hours < 24)  return `${hours}h ago`
  return `${days}d ago`
}

export function PostCard({ post, onPinClick, onResolve, isOwn = false }: PostCardProps) {
  const style = TYPE_STYLES[post.type]

  return (
    <div className={`rounded-lg border ${style.bg} ${style.border} p-3 space-y-2`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${style.text} ${style.bg} border ${style.border}`}>
            {style.label}
          </span>
          <span className="text-xs text-green-400 truncate">
            {post.author_handle}
            {post.author_boat_name && ` · ${post.author_boat_name}`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {post.visibility === 'friends'
            ? <Users size={12} className="text-green-300" />
            : <Globe  size={12} className="text-green-300" />
          }
          <span className="text-xs text-green-300">{timeAgo(post.created_at)}</span>
        </div>
      </div>

      {/* Content */}
      <p className="font-sans font-medium text-green-800 text-sm leading-snug">{post.title}</p>
      {post.body && (
        <p className="text-sm text-green-600 leading-relaxed">{post.body}</p>
      )}

      {/* Footer actions */}
      {(post.lat != null || isOwn) && (
        <div className="flex items-center gap-3 pt-0.5">
          {post.lat != null && (
            <button
              onClick={() => onPinClick?.(post)}
              className="flex items-center gap-1 text-xs text-green-500 hover:text-green-700 transition-colors"
            >
              <MapPin size={12} />
              Show on map
            </button>
          )}
          {isOwn && !post.is_resolved && (
            <button
              onClick={() => onResolve?.(post.id)}
              className="flex items-center gap-1 text-xs text-green-500 hover:text-green-700 transition-colors ml-auto"
            >
              <CheckCircle size={12} />
              Mark resolved
            </button>
          )}
        </div>
      )}
    </div>
  )
}
