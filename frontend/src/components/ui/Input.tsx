import { clsx } from 'clsx';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  suffix?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  error?: string;
  hint?: string;
  accent?: 'primary' | 'secondary';
}

export function Input({
  label,
  suffix,
  prefixIcon,
  error,
  hint,
  accent = 'primary',
  className,
  id,
  ...rest
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const focusRing =
    accent === 'primary'
      ? 'focus:ring-2 focus:ring-[rgba(0,73,230,0.2)] focus:bg-white'
      : 'focus:ring-2 focus:ring-[rgba(133,57,163,0.2)] focus:bg-white';

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-label font-bold text-[#585c60] uppercase tracking-wider mb-2 ml-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {prefixIcon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#585c60]">
            {prefixIcon}
          </span>
        )}
        <input
          id={inputId}
          className={clsx(
            'w-full bg-[#eef1f6] border-none rounded-xl px-4 py-4',
            'transition-all outline-none text-[#2c2f33] placeholder:text-[#aaadb2]',
            focusRing,
            prefixIcon && 'pl-10',
            suffix && 'pr-16',
            error && 'ring-2 ring-[#fb5151] bg-[#fff5f5]',
            className
          )}
          {...rest}
        />
        {suffix && (
          <span className={clsx(
            'absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm pointer-events-none',
            accent === 'primary' ? 'text-[#0049e6]' : 'text-[#8539a3]'
          )}>
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1.5 ml-1 text-xs text-[#b31b25] font-label font-medium animate-fade-in">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5 ml-1 text-xs text-[#585c60] font-label">
          {hint}
        </p>
      )}
    </div>
  );
}
