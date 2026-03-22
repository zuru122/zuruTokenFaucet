
import { clsx } from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  rounded?: 'lg' | 'xl' | '2xl' | '3xl';
  hover?: boolean;
  onClick?: () => void;
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10 md:p-16',
};

const roundedMap = {
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-[2rem]',
  '3xl': 'rounded-3xl',
};

export function GlassCard({
  children,
  className,
  padding = 'lg',
  rounded = '3xl',
  hover = false,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'glass-card border border-white/40',
        paddingMap[padding],
        roundedMap[rounded],
        hover && 'transition-all duration-300 hover:shadow-[0_24px_48px_rgba(0,73,230,0.1)] hover:-translate-y-1 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
