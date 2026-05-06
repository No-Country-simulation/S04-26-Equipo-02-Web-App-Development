import type { UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  type: 'text' | 'email' | 'password';
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: string;
  disabled?: boolean;
}

export function FormField({
  label,
  type,
  placeholder,
  register,
  error,
  disabled = false,
}: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={register.name} className="form-label">
        {label}
      </label>
      <input
        type={type}
        id={register.name}
        placeholder={placeholder}
        className={`form-input ${error ? 'form-input-error' : ''}`}
        disabled={disabled}
        {...register}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}