export function Card({ 
  children, 
  title, 
  subtitle,
  className = '',
  padding = true,
  variant = 'primary',
  ...props 
}) {
  const variants = {
    primary: 'border-[var(--border-color)]',
    secondary: 'border-[var(--accent-secondary)] border-opacity-30',
    tertiary: 'border-[var(--accent-tertiary)] border-opacity-30',
  };

  return (
    <div 
      className={`
        bg-[var(--bg-medium)] 
        border
        rounded-lg
        transition-all duration-200
        hover:border-[var(--border-light)]
        ${variants[variant]}
        ${padding ? 'p-6' : ''}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-[var(--text-secondary)]">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
