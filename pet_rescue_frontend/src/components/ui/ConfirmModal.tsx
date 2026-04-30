import React from 'react';

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void; // Optional for simple alerts
  type?: 'danger' | 'info' | 'success';
};

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = 'info'
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden scale-in">
        <div className={`h-2 ${type === 'danger' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-brand-500'}`} />

        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-xl shrink-0 ${type === 'danger' ? 'bg-red-50 text-red-600' :
                type === 'success' ? 'bg-green-50 text-green-600' :
                  'bg-brand-50 text-brand-600'
              }`}>
              {type === 'danger' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : type === 'success' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 leading-tight mb-1">{title}</h2>
              <p className="text-stone-500 text-sm leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold hover:bg-stone-50 transition-colors text-sm"
              >
                {cancelText}
              </button>
            )}

            <button
              onClick={onConfirm}
              className={`px-5 py-2.5 rounded-xl text-white font-bold transition-all shadow-sm hover:shadow-md active:scale-95 text-sm ${type === 'danger' ? 'bg-red-500 hover:bg-red-600' :
                  type === 'success' ? 'bg-green-500 hover:bg-green-600' :
                    'bg-brand-500 hover:bg-brand-600'
                }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
