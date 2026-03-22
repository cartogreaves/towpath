import Image from 'next/image'

type AvatarSize = 24 | 32 | 36 | 40 | 64

interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: AvatarSize
  boatColour?: string
  className?: string
}

function getInitials(name?: string | null): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

const sizeMap: Record<AvatarSize, { px: string; text: string }> = {
  24: { px: 'w-6 h-6', text: 'text-[9px]' },
  32: { px: 'w-8 h-8', text: 'text-[11px]' },
  36: { px: 'w-9 h-9', text: 'text-xs' },
  40: { px: 'w-10 h-10', text: 'text-sm' },
  64: { px: 'w-16 h-16', text: 'text-lg' },
}

export function Avatar({
  src,
  name,
  size = 40,
  className = '',
}: AvatarProps) {
  const { px, text } = sizeMap[size]
  const initials = getInitials(name)

  if (src) {
    return (
      <div className={`${px} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
        <Image
          src={src}
          alt={name || 'Avatar'}
          width={size}
          height={size}
          className="object-cover w-full h-full"
        />
      </div>
    )
  }

  return (
    <div
      className={`
        ${px} rounded-full flex-shrink-0
        bg-green-50 flex items-center justify-center
        ${className}
      `}
    >
      <span className={`font-display font-bold text-green-600 leading-none ${text}`}>
        {initials}
      </span>
    </div>
  )
}
