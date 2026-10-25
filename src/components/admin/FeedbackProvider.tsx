"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  X,
  Loader2
} from "lucide-react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void | Promise<void>;
}

interface SnackbarState {
  show: boolean;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface ConfirmState extends ConfirmOptions {
  show: boolean;
}

interface FeedbackContextType {
  showSnackbar: (message: string, type?: "success" | "error" | "warning" | "info") => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  confirm: (options: ConfirmOptions) => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  // Snackbar State
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    show: false,
    message: "",
    type: "success",
  });

  // Confirm State
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    show: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const [isConfirming, setIsConfirming] = useState(false);

  // Auto-dismiss Snackbar
  useEffect(() => {
    if (snackbar.show) {
      const timer = setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.show, snackbar.message]);

  const showSnackbar = (message: string, type: "success" | "error" | "warning" | "info" = "success") => {
    setSnackbar({
      show: true,
      message,
      type,
    });
  };

  const showSuccess = (message: string) => showSnackbar(message, "success");
  const showError = (message: string) => showSnackbar(message, "error");
  const showWarning = (message: string) => showSnackbar(message, "warning");
  const showInfo = (message: string) => showSnackbar(message, "info");

  const confirm = (options: ConfirmOptions) => {
    setConfirmState({
      show: true,
      title: options.title,
      message: options.message,
      confirmText: options.confirmText || "Confirm",
      cancelText: options.cancelText || "Cancel",
      isDestructive: options.isDestructive ?? false,
      onConfirm: options.onConfirm,
    });
  };

  const handleConfirmAction = async () => {
    setIsConfirming(true);
    try {
      await confirmState.onConfirm();
    } catch (err) {
      console.error("Error running confirmed action:", err);
      showError("Action failed to execute.");
    } finally {
      setIsConfirming(false);
      setConfirmState((prev) => ({ ...prev, show: false }));
    }
  };

  return (
    <FeedbackContext.Provider
      value={{
        showSnackbar,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        confirm,
      }}
    >
      {children}

      {/* Snackbar Portal */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none max-w-md w-full px-4 sm:px-0">
        <AnimatePresence>
          {snackbar.show && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`pointer-events-auto w-full flex items-start gap-3.5 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${
                snackbar.type === "success"
                  ? "bg-[#0c1612]/95 border-emerald-500/30 text-white shadow-emerald-950/20"
                  : snackbar.type === "error"
                  ? "bg-[#180d0d]/95 border-red-500/30 text-white shadow-red-950/20"
                  : snackbar.type === "warning"
                  ? "bg-[#18140d]/95 border-amber-500/30 text-white shadow-amber-950/20"
                  : "bg-[#0d1318]/95 border-sky-500/30 text-white shadow-sky-950/20"
              }`}
            >
              {/* Type Indicator Line */}
              <div 
                className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-md ${
                  snackbar.type === "success"
                    ? "bg-emerald-500"
                    : snackbar.type === "error"
                    ? "bg-red-500"
                    : snackbar.type === "warning"
                    ? "bg-amber-500"
                    : "bg-sky-500"
                }`}
              />

              <div className="flex-shrink-0 ml-1.5 mt-0.5">
                {snackbar.type === "success" && (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                )}
                {snackbar.type === "error" && (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
                {snackbar.type === "warning" && (
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                )}
                {snackbar.type === "info" && (
                  <Info className="h-5 w-5 text-sky-400" />
                )}
              </div>

              <div className="flex-1 text-sm font-medium leading-relaxed pr-2">
                {snackbar.message}
              </div>

              <button
                onClick={() => setSnackbar((prev) => ({ ...prev, show: false }))}
                className="close-x"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" strokeWidth={3} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmState.show && (
          <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isConfirming) setConfirmState((prev) => ({ ...prev, show: false }));
              }}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-md bg-[#0d1411] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10"
            >
              {/* Top Accent Gradient Border */}
              <div 
                className={`h-1.5 w-full bg-gradient-to-r ${
                  confirmState.isDestructive 
                    ? "from-red-500 to-rose-600" 
                    : "from-green-500 to-emerald-600"
                }`}
              />

              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div 
                    className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                      confirmState.isDestructive 
                        ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                        : "bg-green-500/10 text-green-400 border border-green-500/20"
                    }`}
                  >
                    {confirmState.isDestructive ? (
                      <AlertTriangle className="h-6 w-6" />
                    ) : (
                      <HelpCircleIcon className="h-6 w-6" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {confirmState.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line">
                      {confirmState.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-white/5">
                  <button
                    disabled={isConfirming}
                    onClick={() => setConfirmState((prev) => ({ ...prev, show: false }))}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white rounded-xl font-bold transition-all text-sm"
                  >
                    {confirmState.cancelText}
                  </button>
                  <button
                    disabled={isConfirming}
                    onClick={handleConfirmAction}
                    className={`px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 text-sm flex items-center gap-2 ${
                      confirmState.isDestructive
                        ? "bg-red-500 hover:bg-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                        : "bg-green-500 hover:bg-green-400 text-black shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                    }`}
                  >
                    {isConfirming && <Loader2 className="h-4 w-4 animate-spin" />}
                    {confirmState.confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
}

// Simple internal icon component to prevent layout compilation issues
function HelpCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
