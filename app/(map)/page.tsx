'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion, type Variants, type Easing } from 'framer-motion'
import { BetweenVerticalStart, RotateCcw, Waves, ArrowLeftRight, Milestone, AlertTriangle, Navigation } from 'lucide-react'
import { useMapContext } from './MapContext'
import { useCanalInfrastructure } from '@/lib/hooks/useCanalInfrastructure'
import type { InfrastructurePoint } from '@/lib/hooks/useCanalInfrastructure'
import type { FilterValue } from './MapContext'

const ease = {
  out: 'easeOut' as Easing,
  in:  'easeIn'  as Easing,
}

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: ease.out } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.15, ease: ease.in } },
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  lock:          <BetweenVerticalStart size={18} strokeWidth={1.5} />,
  winding_hole:  <RotateCcw size={18} strokeWidth={1.5} />,
  bridge:        <ArrowLeftRight size={18} strokeWidth={1.5} />,
  aqueduct:      <Waves size={18} strokeWidth={1.5} />,
  tunnel_portal: <Milestone size={18} strokeWidth={1.5} />,
  weir:          <AlertTriangle size={18} strokeWidth={1.5} />,
}

const TYPE_COLOURS: Record<string, string> = {
  lock:          'text-[#8A7558]',
  winding_hole:  'text-[#A09070]',
  bridge:        'text-[#6B5A42]',
  aqueduct:      'text-water-500',
  tunnel_portal: 'text-[#4A5A3A]',
  weir:          'text-green-500',
  culvert:       'text-green-400',
  reservoir:     'text-water-500',
  wharf:         'text-rust-500',
}

const TYPE_LABELS: Record<string, string> = {
  lock:          'Lock',
  winding_hole:  'Winding hole',
  bridge:        'Bridge',
  aqueduct:      'Aqueduct',
  tunnel_portal: 'Tunnel portal',
  weir:          'Weir',
  culvert:       'Culvert',
  reservoir:     'Reservoir',
  wharf:         'Wharf',
}

function InfraCard({ point }: { point: InfrastructurePoint }) {
  const icon   = TYPE_ICONS[point.type]
  const colour = TYPE_COLOURS[point.type] ?? 'text-green-500'
  const label  = TYPE_LABELS[point.type] ?? point.type.replace(/_/g, ' ')

  return (
    <div className="bg-bg-surface border border-green-100 rounded-lg p-4 shadow-card">
      <div className="flex items-start gap-3 mb-3">
        <div className={`mt-0.5 ${colour}`}>{icon ?? <Navigation size={18} strokeWidth={1.5} />}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-green-400 mb-0.5">{label}</p>
          <h3 className="font-display text-h2 text-green-800 font-bold leading-tight">
            {point.sap_description}
          </h3>
          {point.waterway_name && (
            <p className="text-sm text-green-400 mt-0.5">{point.waterway_name}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MapHomePage() {
  const { activeFilter, selectedPoi, setSelectedPoi, setSnap } = useMapContext()

  useEffect(() => { setSnap('quarter') }, [setSnap])

  const typeFilter = activeFilter as FilterValue
  const { data: points = [] } = useCanalInfrastructure(typeFilter)

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
          <InfraCard point={selectedPoi} />
        </>
      ) : points.length > 0 ? (
        <>
          <p className="text-sm text-green-400 font-medium">
            {points.length} feature{points.length !== 1 ? 's' : ''} in view
          </p>
          <AnimatePresence initial={false} mode="popLayout">
            {points.slice(0, 20).map((pt) => (
              <motion.button
                key={pt.id}
                className="w-full text-left"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                onClick={() => { setSelectedPoi(pt); setSnap('half') }}
              >
                <InfraCard point={pt} />
              </motion.button>
            ))}
          </AnimatePresence>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="font-display text-h2 text-green-800 mb-2">Nothing here yet</p>
          <p className="text-body text-green-400">Pan the map to explore the canal network</p>
        </div>
      )}
    </div>
  )
}
