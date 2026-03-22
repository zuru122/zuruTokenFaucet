
import { clsx } from 'clsx';
import { GlassCard } from './GlassCard';

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  subValue?: string;
  isLoading?: boolean;
  wide?: boolean;
  children?: React.ReactNode;
  className?: string;
  accent?: 'primary' | 'secondary' | 'tertiary';
}

const accentColors = {
  primary: 'text-[#0049e6]',
  secondary: 'text-[#8539a3]',
  tertiary: 'text-[#006574]',
};

export function StatCard({
  label,
  value,
  unit,
  subValue,
  isLoading = false,
  wide = false,
  children,
  className,
  accent = 'primary',
}: StatCardProps) {
  return (
    <GlassCard
      rounded="3xl"
      className={clsx(
        'flex flex-col justify-between min-h-[160px] overflow-hidden relative',
        wide && 'md:col-span-1 lg:col-span-2',
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[#585c60] text-xs font-label uppercase tracking-widest font-bold">
          {label}
        </span>
        {subValue && (
          <span className="text-[#585c60] text-sm font-body">{subValue}</span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <div className="h-9 w-32 rounded-lg shimmer-loading" />
          {unit && <div className="h-4 w-16 rounded shimmer-loading" />}
        </div>
      ) : (
        <div className="flex items-baseline gap-2">
          <span className="text-3xl md:text-4xl font-headline font-black text-[#2c2f33]">
            {value}
          </span>
          {unit && (
            <span className={clsx('font-bold text-base', accentColors[accent])}>
              {unit}
            </span>
          )}
        </div>
      )}

      {children}
    </GlassCard>
  );
}
