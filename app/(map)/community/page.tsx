'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMapContext } from '../MapContext'
import { useCommunityPosts } from '@/lib/hooks/useCommunityPosts'
import { useProfile } from '@/lib/hooks/useProfile'
import { PostCard } from '@/components/ui/PostCard'
import { CreatePostForm } from '@/components/forms/CreatePostForm'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import type { CommunityPost } from '@/lib/types/database'

const itemVariants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.2 } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.15 } },
}

export default function CommunityPage() {
  const { setSnap, setSelectedCommunityPost } = useMapContext()
  const { isLoggedIn, profile } = useProfile()
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => { setSnap('half') }, [setSnap])

  const { data: posts = [], refetch } = useCommunityPosts()

  function handlePinClick(post: CommunityPost) {
    setSelectedCommunityPost(post)
    setSnap('quarter')
  }

  async function handleResolve(id: string) {
    const { createClient } = await import('@/lib/supabase/client')
    await createClient().from('community_posts').update({ is_resolved: true }).eq('id', id)
    refetch()
  }

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-h1 text-green-800 font-bold">Community</h2>
        {isLoggedIn && (
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus size={14} />
            Post
          </Button>
        )}
      </div>

      {showCreate && (
        <div className="mb-4">
          <CreatePostForm
            onSuccess={() => { setShowCreate(false); refetch() }}
            onCancel={() => setShowCreate(false)}
          />
        </div>
      )}

      {!isLoggedIn && (
        <p className="text-sm text-green-400 mb-4">
          <a href="/auth/sign-in" className="underline">Sign in</a> to post asks and offers.
        </p>
      )}

      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-display text-h2 text-green-800 mb-2">Nothing posted yet</p>
            <p className="text-body text-green-400">Be the first to post an ask or offer on this stretch.</p>
          </div>
        ) : (
          <AnimatePresence initial={false} mode="popLayout">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <PostCard
                  post={post}
                  onPinClick={handlePinClick}
                  onResolve={handleResolve}
                  isOwn={post.author_id === profile?.id}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
