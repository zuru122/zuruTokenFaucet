
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-primary text-white shadow-lg shadow-[rgba(0,73,230,0.2)] hover:shadow-[rgba(0,73,230,0.35)] hover:scale-[1.02] active:scale-[0.98]',
  secondary:
    'bg-gradient-secondary text-white shadow-lg shadow-[rgba(133,57,163,0.2)] hover:shadow-[rgba(133,57,163,0.35)] hover:scale-[1.02] active:scale-[0.98]',
  ghost:
    'bg-[#eef1f6] text-[#0049e6] hover:bg-[#e5e8ee] active:scale-[0.98]',
  outline:
    'bg-white text-[#0049e6] border border-[rgba(0,73,230,0.2)] hover:bg-[#0049e6] hover:text-white active:scale-[0.98]',
  danger:
    'bg-[#fb5151] text-white shadow-lg shadow-[rgba(179,27,37,0.2)] hover:shadow-[rgba(179,27,37,0.35)] hover:scale-[1.02] active:scale-[0.98]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-2.5 text-sm gap-2',
  lg: 'px-8 py-3.5 text-base gap-2',
  xl: 'px-12 py-5 text-lg gap-3',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={clsx(
        // Base
        'relative inline-flex items-center justify-center font-headline font-bold rounded-full',
        'transition-all duration-300 cursor-pointer select-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0049e6]',
        // Variant
        variantClasses[variant],
        // Size
        sizeClasses[size],
        // Width
        fullWidth && 'w-full',
        // Disabled
        isDisabled && 'opacity-60 cursor-not-allowed pointer-events-none scale-100',
        className
      )}
      {...rest}
    >
      {loading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
