"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, subtitle, icon, iconBg = "bg-white/5", children, footer }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0e1a] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className={`p-2.5 rounded-xl border ${iconBg}`}>
                    {icon}
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-white">{title}</h2>
                  {subtitle && <p className="text-white/50 text-sm">{subtitle}</p>}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">{children}</div>

            {footer && (
              <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-white/5">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
