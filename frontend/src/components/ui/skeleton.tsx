import { cn } from '@/lib/utils'

type SkeletonVariant = 'text' | 'card' | 'circle'
type SkeletonAnimation = 'pulse' | 'shimmer'

interface SkeletonProps {
  variant?: SkeletonVariant
  className?: string
  animation?: SkeletonAnimation
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full rounded',
  card: 'h-48 w-full rounded-xl',
  circle: 'size-10 rounded-full',
}

function Skeleton({ variant = 'text', className, animation = 'pulse' }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        animation === 'pulse' ? 'animate-pulse bg-muted' : 'relative overflow-hidden bg-muted',
        variantStyles[variant],
        className,
      )}
    >
      {animation === 'shimmer' && (
        <div className="absolute inset-0 skeleton-shimmer" />
      )}
    </div>
  )
}

export { Skeleton, type SkeletonProps, type SkeletonVariant, type SkeletonAnimation }
