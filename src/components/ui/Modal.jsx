'use client';

import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-lg ${sizes[size]} w-full max-h-[90vh] overflow-hidden shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', variant = 'danger' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-lg max-w-md w-full shadow-2xl">
        <div className="p-6">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
            {title}
          </h3>
          <p className="text-[var(--text-secondary)] mb-6">
            {message}
          </p>
          
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              variant={variant === 'danger' ? 'primary' : 'secondary'}
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700 flex-1' : 'flex-1'}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
