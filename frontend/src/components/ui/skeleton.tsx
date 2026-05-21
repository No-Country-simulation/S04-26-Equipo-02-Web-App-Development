import { cn } from '@/lib/utils'

type SkeletonVariant = 'text' | 'card' | 'circle'

interface SkeletonProps {
  variant?: SkeletonVariant
  className?: string
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full rounded',
  card: 'h-48 w-full rounded-xl',
  circle: 'size-10 rounded-full',
}

function Skeleton({ variant = 'text', className }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'animate-pulse bg-muted',
        variantStyles[variant],
        className,
      )}
    />
  )
}

export { Skeleton, type SkeletonProps, type SkeletonVariant }
