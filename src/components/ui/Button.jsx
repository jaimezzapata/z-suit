export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) {
  const baseStyles = 'font-medium transition-all duration-200 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[var(--accent-primary)] text-[var(--bg-darkest)] hover:bg-[var(--accent-hover)] active:scale-95',
    secondary: 'bg-[var(--bg-medium)] text-[var(--text-primary)] border border-[var(--border-color)] hover:border-[var(--accent-muted)] hover:bg-[var(--bg-light)]',
    ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-medium)] hover:text-[var(--text-primary)]',
    danger: 'bg-[var(--error)] text-white hover:opacity-90 active:scale-95',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
