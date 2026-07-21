import { SelectHTMLAttributes, forwardRef } from 'react'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, options, className = '', ...props }, ref) => (
    <div>
      {label && <label className="block text-xs font-medium text-text-secondary mb-1.5">{label}</label>}
      <select
        ref={ref}
        className={`w-full bg-primary border border-gray-700 rounded-md px-3 py-2 text-sm text-text-primary
          outline-none transition-colors duration-150 cursor-pointer
          focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30
          ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  ),
)
Select.displayName = 'Select'
