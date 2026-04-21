'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
}

interface NotificationContextType {
  showNotification: (type: NotificationType, title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DS = `
  .toast-container {
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: auto;
    min-width: 320px;
    max-width: 420px;
    pointer-events: none;
  }

  .toast-item {
    pointer-events: auto;
    filter: drop-shadow(0 20px 40px rgba(0,0,0,0.4));
    animation: toast-slide-in 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
  }

  .toast-item.out {
    animation: toast-slide-out 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
  }

  @keyframes toast-slide-in {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes toast-slide-out {
    from {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateX(20px) scale(0.95);
    }
  }
`;

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((type: NotificationType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, type, title, message }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  /* 
    PREMIUM GSAP HOOK (Optional)
    If you install GSAP, you can use a ref and GSAP to animate these items:
    
    import gsap from 'gsap';
    ...
    useEffect(() => {
      if (notifications.length > 0) {
        gsap.fromTo(".toast-item", { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "expo.out" });
      }
    }, [notifications]);
  */

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      <style>{DS}</style>
      {children}
      <div className="toast-container">
        {notifications.map((n) => (
          <div key={n.id} className="toast-item">
            <Alert variant={n.type === 'error' ? 'destructive' : 'default'} className="shadow-2xl border-[#1e1e1e]">
              {n.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={2.5} />}
              {n.type === 'error' && <AlertCircle className="h-4 w-4" />}
              {n.type === 'info' && <Info className="h-4 w-4" />}
              <AlertTitle>{n.title}</AlertTitle>
              {n.message && <AlertDescription>{n.message}</AlertDescription>}
            </Alert>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
