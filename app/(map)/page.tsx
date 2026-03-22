'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion, type Variants, type Easing } from 'framer-motion'
import { useMapContext } from './MapContext'
import { usePOIs } from '@/lib/hooks/usePOIs'
import { useProfile } from '@/lib/hooks/useProfile'
import { ServiceCard } from '@/components/ui/ServiceCard'
import type { PoiType } from '@/lib/types/database'

const ease = {
  out: 'easeOut' as Easing,
  in:  'easeIn'  as Easing,
}

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: ease.out } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.15, ease: ease.in } },
}

export default function MapHomePage() {
  const { activeFilter, selectedPoi, setSelectedPoi, setSnap } = useMapContext()
  const { isLoggedIn } = useProfile()

  useEffect(() => { setSnap('quarter') }, [setSnap])

  const poiTypeFilter: PoiType | null =
    activeFilter && activeFilter !== 'events' && activeFilter !== 'stoppages'
      ? (activeFilter as PoiType)
      : null

  const { data: pois = [] } = usePOIs(poiTypeFilter)

  return (
    <div className="px-4 pb-4 space-y-3">
      {selectedPoi ? (
        <>
          <button
            className="text-sm text-green-400 flex items-center gap-1"
            onClick={() => setSelectedPoi(null)}
          >
            ← Back to list
          </button>
          <ServiceCard poi={selectedPoi} isLoggedIn={isLoggedIn} />
        </>
      ) : pois.length > 0 ? (
        <>
          <p className="text-sm text-green-400 font-medium">
            {pois.length} service{pois.length !== 1 ? 's' : ''} in view
          </p>
          <AnimatePresence initial={false} mode="popLayout">
            {pois.slice(0, 20).map((poi) => (
              <motion.button
                key={poi.id}
                className="w-full text-left"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                onClick={() => { setSelectedPoi(poi); setSnap('half') }}
              >
                <ServiceCard poi={poi} isLoggedIn={isLoggedIn} />
              </motion.button>
            ))}
          </AnimatePresence>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="font-display text-h2 text-green-800 mb-2">Nothing here yet</p>
          <p className="text-body text-green-400">Pan the map to find canal services</p>
        </div>
      )}
    </div>
  )
}
