import React, { useEffect } from 'react';
import { ExclamationTriangleIcon, XCircleIcon } from './Icons';
import { XIcon } from './Icons';

interface NotificationProps {
  message: string;
  type: 'warning' | 'error';
  onDismiss: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onDismiss }) => {
  useEffect(() => {
    // Opsional: tutup otomatis peringatan setelah beberapa waktu
    if (type === 'warning') {
      const timer = setTimeout(() => {
        onDismiss();
      }, 8000); // 8 detik
      return () => clearTimeout(timer);
    }
  }, [type, onDismiss]);

  const bgColor = type === 'warning' ? 'bg-yellow-100 border-yellow-400' : 'bg-red-100 border-red-400';
  const textColor = type === 'warning' ? 'text-yellow-800' : 'text-red-800';
  const icon = type === 'warning' ? <ExclamationTriangleIcon /> : <XCircleIcon />;

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full">
      <div 
        role="alert"
        className={`relative flex items-start gap-4 p-4 rounded-lg border shadow-lg animate-fade-in-right ${bgColor}`}
      >
        <div className={`flex-shrink-0 ${textColor}`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className={`font-semibold ${textColor}`}>{type === 'warning' ? 'Peringatan' : 'Batas Tercapai'}</p>
          <p className={`text-sm ${textColor}`}>{message}</p>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Tutup notifikasi"
          className={`absolute top-2 right-2 p-1 rounded-full hover:bg-black/10 transition-colors ${textColor}`}
        >
          <XIcon />
        </button>
      </div>
       <style>{`
          @keyframes fade-in-right {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-fade-in-right {
            animation: fade-in-right 0.5s ease-out forwards;
          }
        `}</style>
    </div>
  );
};

export default Notification;
