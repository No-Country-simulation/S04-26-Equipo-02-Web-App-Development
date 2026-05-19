import type { UseFormRegisterReturn } from 'react-hook-form'
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface FormFieldProps {
  label: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  placeholder?: string
  register: UseFormRegisterReturn
  error?: string
  disabled?: boolean
  autoComplete?: string
}

export function FormField({
  label,
  type = 'text',
  placeholder,
  register,
  error,
  disabled = false,
  autoComplete,
}: FormFieldProps) {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          autoComplete={autoComplete}
          {...register}
        />
      </FormControl>
      <FormMessage>{error}</FormMessage>
    </FormItem>
  )
}