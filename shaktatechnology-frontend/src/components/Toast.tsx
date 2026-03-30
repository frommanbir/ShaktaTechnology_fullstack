"use client";

import { useEffect, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

interface ToastProps {
  title: string;
  description: string;
  variant?: "default" | "destructive";
  duration?: number;
}

export function Toast({ title, description, variant = "default", duration = 4000 }: ToastProps) {
  const [visible, setVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => setVisible(false), 300); 
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] flex items-start gap-4 p-4 min-w-[320px] max-w-md rounded-2xl shadow-2xl border transition-all duration-300 transform ${
        isClosing ? "opacity-0 translate-x-12 scale-95" : "animate-in fade-in slide-in-from-right-8 duration-300"
      } ${
        variant === "destructive"
          ? "bg-white dark:bg-red-950 border-red-200 dark:border-red-900"
          : "bg-white dark:bg-emerald-950 border-emerald-200 dark:border-emerald-900"
      }`}
    >
      <div className={`p-2 rounded-xl ${
        variant === "destructive" ? "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400" : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400"
      }`}>
        {variant === "destructive" ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
      </div>
      
      <div className="flex-1 pt-1">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
          {title}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
          {description}
        </p>
      </div>

      <button 
        onClick={() => setIsClosing(true)}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
      >
        <X size={16} />
      </button>

      <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 transition-all rounded-full overflow-hidden" 
           style={{ 
             width: '100%', 
             animation: `shrinkWidth ${duration}ms linear forwards`, 
             backgroundColor: variant === 'destructive' ? '#ef4444' : '#10b981' 
           }}>
      </div>

      <style jsx>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

export function useToast() {
  return useMemo(() => ({
    toast: ({
      title,
      description,
      variant = "default",
      duration = 4000,
    }: {
      title: string;
      description: string;
      variant?: "default" | "destructive";
      duration?: number;
    }) => {
      const container = document.createElement("div");
      document.body.appendChild(container);

      const root = createRoot(container);
      root.render(<Toast title={title} description={description} variant={variant} duration={duration} />);

      setTimeout(() => {
        root.unmount();
        container.remove();
      }, duration + 800);
    },
  }), []);
}