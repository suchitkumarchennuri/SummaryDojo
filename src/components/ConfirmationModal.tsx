"use client";

import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isProcessing: boolean;
  processingText: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isProcessing = false,
  processingText = "Processing...",
  onConfirm,
  onCancel,
  confirmButtonClassName = "bg-red-600 hover:bg-red-700 text-white",
  cancelButtonClassName = "bg-gray-200 hover:bg-gray-300 text-gray-800",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="theme-card w-full max-w-sm mx-auto p-5 animate-fade-in overflow-hidden">
        <div
          className="flex items-center justify-center mb-4"
          style={{ color: "var(--danger)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-center mb-3 truncate text-heading">
          {title}
        </h3>
        <div className="px-2">
          <p className="text-secondary text-center mb-6 break-words text-sm sm:text-base">
            {message}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className={`py-2 px-4 rounded-lg font-medium transition-colors flex-1 sm:flex-none truncate min-w-0 ${cancelButtonClassName}`}
            onClick={onCancel}
            disabled={isProcessing}
          >
            <span className="truncate">{cancelText}</span>
          </button>
          <button
            className={`py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center flex-1 sm:flex-none min-w-0 ${confirmButtonClassName}`}
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="truncate">{processingText}</span>
              </>
            ) : (
              <span className="truncate">{confirmText}</span>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
