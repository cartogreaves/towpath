'use client'

export type SnapPoint = 'quarter' | 'half' | 'full'

interface BottomSheetProps {
  snap: SnapPoint
  onSnapChange: (snap: SnapPoint) => void
  children: React.ReactNode
  showBackdrop?: boolean
}

const QUARTER_HEIGHT = 236  // px visible above nav at quarter snap
const BOTTOM_NAV_HEIGHT = 56
const HANDLE_HEIGHT = 28

// Sheet is positioned top:0 bottom:BOTTOM_NAV_HEIGHT, so its height = 100vh - 56px.
// translateY positions the visible top edge of the sheet.
function getTranslateY(snap: SnapPoint): string {
  switch (snap) {
    case 'quarter': return `calc(100% - ${QUARTER_HEIGHT}px)`
    case 'half':    return '50vh'
    case 'full':    return `${BOTTOM_NAV_HEIGHT}px`
  }
}

// Scroll area = visible sheet height minus the drag handle
function getScrollMaxHeight(snap: SnapPoint): string {
  switch (snap) {
    // Sheet bottom is at 100vh-56px; top at (100vh-56px-236px) → visible = 236px
    case 'quarter': return `${QUARTER_HEIGHT - HANDLE_HEIGHT}px`
    // Sheet top at 50vh, bottom at 100vh-56px → visible = 50vh-56px
    case 'half':    return `calc(50vh - ${BOTTOM_NAV_HEIGHT + HANDLE_HEIGHT}px)`
    // Sheet top at 56px, bottom at 100vh-56px → visible = 100vh-112px
    case 'full':    return `calc(100vh - ${BOTTOM_NAV_HEIGHT * 2 + HANDLE_HEIGHT}px)`
  }
}

export function BottomSheet({ snap, onSnapChange, children, showBackdrop = false }: BottomSheetProps) {
  function handleTap() {
    if (snap === 'quarter') onSnapChange('half')
    else if (snap === 'half') onSnapChange('quarter')
    else onSnapChange('half')
  }

  return (
    <>
      {showBackdrop && snap !== 'quarter' && (
        <div
          className="fixed inset-0 z-40 pointer-events-auto"
          style={{ background: 'rgba(44,58,42,0.12)' }}
          onClick={() => onSnapChange('quarter')}
        />
      )}

      <div
        className="fixed left-0 right-0 z-50 bg-bg-surface rounded-t-xl shadow-overlay sheet-transition"
        style={{
          top: 0,
          bottom: BOTTOM_NAV_HEIGHT,
          transform: `translateY(${getTranslateY(snap)})`,
        }}
      >
        {/* Handle — tap to toggle quarter ↔ half */}
        <div
          className="flex justify-center pt-2.5 pb-2 cursor-pointer select-none"
          onClick={handleTap}
        >
          <div className="w-8 h-1 rounded-full bg-green-200" />
        </div>

        {/* Scrollable content */}
        <div
          className="overflow-y-auto overscroll-contain"
          style={{
            maxHeight: getScrollMaxHeight(snap),
            transition: 'max-height 300ms cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          {children}
        </div>
      </div>
    </>
  )
}
