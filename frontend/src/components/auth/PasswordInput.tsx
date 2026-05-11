'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  containerClassName?: string
}

function PasswordInput({ className, containerClassName, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  const togglePassword = React.useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  return (
    <div className={cn('relative', containerClassName)}>
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-10', className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent hover:text-foreground"
        onClick={togglePassword}
        tabIndex={-1}
        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {showPassword ? (
          <EyeOff className="size-4 text-muted-foreground" />
        ) : (
          <Eye className="size-4 text-muted-foreground" />
        )}
      </Button>
    </div>
  )
}

export { PasswordInput }