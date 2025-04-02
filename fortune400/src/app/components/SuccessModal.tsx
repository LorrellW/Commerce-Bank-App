// SuccessModal.tsx
"use client";

import React, { useEffect } from "react";

interface SuccessModalProps {
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ message, onClose }) => {
  // Auto-close modal after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black opacity-50" 
        onClick={onClose} 
      />
      {/* Modal content */}
      <div className="bg-white rounded-lg shadow-lg p-6 z-10">
        <p className="text-xl text-black font-semibold text-center">{message}</p>
      </div>
    </div>
  );
};

export default SuccessModal;
