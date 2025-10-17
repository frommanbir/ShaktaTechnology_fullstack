"use client";

import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

interface ToastProps {
  title: string;
  description: string;
  variant?: "default" | "destructive";
  duration?: number;
}

export function Toast({ title, description, variant = "default", duration = 4000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
        variant === "destructive"
          ? "bg-red-500 text-white border border-red-700"
          : "bg-green-500 text-white border border-green-700"
      }`}
    >
      <h3 className="font-bold">{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export function useToast() {
  return {
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
      }, duration + 500);
    },
  };
}