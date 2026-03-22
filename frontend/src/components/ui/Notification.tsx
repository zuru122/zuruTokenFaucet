import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { useAppContext } from '../../context/AppContext';
import type { NotificationItem } from '../../types';

const typeConfig = {
  success: {
    icon: 'check_circle',
    bg: 'bg-white border-l-4 border-l-[#0049e6]',
    iconColor: 'text-[#0049e6]',
    titleColor: 'text-[#2c2f33]',
  },
  error: {
    icon: 'error',
    bg: 'bg-white border-l-4 border-l-[#b31b25]',
    iconColor: 'text-[#b31b25]',
    titleColor: 'text-[#2c2f33]',
  },
  warning: {
    icon: 'warning',
    bg: 'bg-white border-l-4 border-l-[#e6a000]',
    iconColor: 'text-[#e6a000]',
    titleColor: 'text-[#2c2f33]',
  },
  info: {
    icon: 'info',
    bg: 'bg-white border-l-4 border-l-[#006574]',
    iconColor: 'text-[#006574]',
    titleColor: 'text-[#2c2f33]',
  },
};

function ToastItem({ notification }: { notification: NotificationItem }) {
  const { removeNotification } = useAppContext();
  const [visible, setVisible] = useState(false);
  const config = typeConfig[notification.type];

  useEffect(() => {
    // Trigger enter animation
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      className={clsx(
        'flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
        'transition-all duration-300 max-w-sm w-full',
        config.bg,
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      )}
    >
      <span
        className={clsx('material-symbols-outlined text-xl flex-shrink-0 mt-0.5', config.iconColor)}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {config.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm font-headline font-bold', config.titleColor)}>
          {notification.title}
        </p>
        <p className="text-xs text-[#585c60] mt-0.5 font-body leading-relaxed">
          {notification.message}
        </p>
      </div>
      <button
        onClick={() => removeNotification(notification.id)}
        className="flex-shrink-0 text-[#aaadb2] hover:text-[#585c60] transition-colors mt-0.5"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}

export function NotificationContainer() {
  const { notifications } = useAppContext();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-4 md:right-6 z-[100] flex flex-col gap-2 items-end">
      {notifications.map((n) => (
        <ToastItem key={n.id} notification={n} />
      ))}
    </div>
  );
}
