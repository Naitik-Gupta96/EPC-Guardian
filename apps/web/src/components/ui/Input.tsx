import { InputHTMLAttributes, forwardRef } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, className = '', ...props }, ref) => (
    <div>
      {label && <label className="block text-xs font-medium text-text-secondary mb-1.5">{label}</label>}
      <input
        ref={ref}
        className={`w-full bg-primary border border-gray-700 rounded-md px-3 py-2 text-sm text-text-primary
          placeholder:text-text-muted outline-none transition-colors duration-150
          focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30
          ${className}`}
        {...props}
      />
    </div>
  ),
)
Input.displayName = 'Input'
