export function Input({ 
  label, 
  error, 
  type = 'text', 
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
          {label}
          {required && <span className="text-[var(--error)] ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-2 
          bg-[var(--bg-medium)] 
          border border-[var(--border-color)]
          rounded-lg
          text-[var(--text-primary)]
          placeholder:text-[var(--text-tertiary)]
          focus:outline-none 
          focus:border-[var(--accent-primary)]
          focus:ring-2 
          focus:ring-[var(--accent-primary)]
          focus:ring-opacity-20
          disabled:opacity-50 
          disabled:cursor-not-allowed
          transition-all duration-200
          ${error ? 'border-[var(--accent-primary)] focus:border-[var(--accent-primary)] focus:ring-[var(--accent-primary)]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-[var(--accent-primary)] mt-1 font-medium">{error}</p>
      )}
    </div>
  );
}
