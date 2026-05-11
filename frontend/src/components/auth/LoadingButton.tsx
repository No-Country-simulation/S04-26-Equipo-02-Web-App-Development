'use client'

import { Loader2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ButtonProps } from '@/components/ui/button'

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
  loadingText?: string
}

function LoadingButton({
  loading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={loading || disabled}
      className={className}
      {...props}
    >
      {loading && <Loader2Icon className="size-4 animate-spin" />}
      {loading && loadingText ? loadingText : children}
    </Button>
  )
}

export { LoadingButton }