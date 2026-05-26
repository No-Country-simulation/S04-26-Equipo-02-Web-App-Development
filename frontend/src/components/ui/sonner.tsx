'use client'

import type { ToasterProps } from 'sonner'
import { Toaster as Sonner } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group-[.toaster]:bg-white dark:group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:font-semibold',
          description: 'group-[.toast]:text-muted-foreground group-[.toast]:font-normal',
          actionButton: 'group-[.toast]:bg-brand-sage group-[.toast]:text-white group-[.toast]:rounded-lg hover:group-[.toast]:bg-brand-olive transition-colors duration-200',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg',
          success: 'group-[.toaster]:bg-[#F3F7F2] group-[.toaster]:text-[#7B9E6B] group-[.toaster]:border-[#7B9E6B]/30 dark:group-[.toaster]:bg-[#1b2b18]/40 dark:group-[.toaster]:text-[#8B9A6B] dark:group-[.toaster]:border-[#8B9A6B]/20',
          error: 'group-[.toaster]:bg-[#FDF5F3] group-[.toaster]:text-[#D4826A] group-[.toaster]:border-[#D4826A]/30 dark:group-[.toaster]:bg-[#2c1d19]/40 dark:group-[.toaster]:text-[#D4826A] dark:group-[.toaster]:border-[#D4826A]/20',
          info: 'group-[.toaster]:bg-[#F9F7F2] group-[.toaster]:text-[#C4A962] group-[.toaster]:border-[#C4A962]/30 dark:group-[.toaster]:bg-[#2c291d]/40 dark:group-[.toaster]:text-[#C4A962] dark:group-[.toaster]:border-[#C4A962]/20',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }