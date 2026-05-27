import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDanger = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl p-6 w-full max-w-sm mx-4 shadow-xl border border-gray-100 relative overflow-hidden"
        >
          {/* Header icon decoration */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDanger ? 'bg-red-50 text-red-500' : 'bg-brand-sage/10 text-brand-sage'}`}>
              {isDanger ? <AlertTriangle className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
            </div>
            <h3 className="text-lg font-black text-brand-heading">{title}</h3>
          </div>

          <p className="text-gray-500 text-sm font-medium mb-6 leading-relaxed">
            {description}
          </p>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-2xl border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 rounded-2xl font-bold text-white shadow-md transition-all duration-300 ${
                isDanger 
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/10' 
                  : 'bg-brand-sage hover:bg-brand-sage-hover shadow-brand-sage/15'
              }`}
            >
              {confirmText}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
