import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = "info", message, duration = 3800 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 6);
      setToasts((prev) => [...prev, { id, type, message }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toast = {
    success: (msg, dur) => addToast({ type: "success", message: msg, duration: dur }),
    error: (msg, dur) => addToast({ type: "error", message: msg, duration: dur }),
    info: (msg, dur) => addToast({ type: "info", message: msg, duration: dur }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-region" aria-live="polite" role="status">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`toast-item toast-${item.type}`}
            data-testid={`toast-${item.type}`}
          >
            {item.type === "success" && (
              <CheckCircle2 size={16} style={{ color: "var(--color-success)", flexShrink: 0, marginTop: "2px" }} />
            )}
            {item.type === "error" && (
              <AlertCircle size={16} style={{ color: "var(--color-error)", flexShrink: 0, marginTop: "2px" }} />
            )}
            {item.type === "info" && (
              <Info size={16} style={{ color: "var(--color-accent)", flexShrink: 0, marginTop: "2px" }} />
            )}
            <span style={{ flex: 1, lineHeight: "1.4" }}>{item.message}</span>
            <button
              type="button"
              className="toast-close-btn"
              onClick={() => removeToast(item.id)}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Return graceful no-op if used outside provider
    return {
      success: (msg) => console.log("[Toast Success]", msg),
      error: (msg) => console.error("[Toast Error]", msg),
      info: (msg) => console.log("[Toast Info]", msg),
    };
  }
  return context;
}
