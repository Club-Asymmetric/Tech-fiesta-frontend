"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { PaymentWarnings } from "@/services/payment";

interface PaymentWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  warnings: PaymentWarnings;
}

export default function PaymentWarningModal({
  isOpen,
  onClose,
  onProceed,
  warnings,
}: PaymentWarningModalProps) {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900">
                {warnings.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Subtitle */}
          <p className="text-gray-600 mb-6">{warnings.subtitle}</p>

          {/* Warnings List */}
          <div className="space-y-3 mb-6">
            {warnings.warnings.map((warning, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700 font-medium">{warning}</p>
              </div>
            ))}
          </div>

          {/* Additional Important Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">
              Why is this important?
            </h3>
            <p className="text-sm text-yellow-700">
              Our payment system uses client-side verification. If you close this page 
              during payment, your payment may succeed but your registration won't be 
              completed automatically. This could result in payment without registration.
            </p>
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-3 mb-6">
            <input
              type="checkbox"
              id="understand-warnings"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="understand-warnings"
              className="text-sm text-gray-700 cursor-pointer"
            >
              I understand these instructions and will keep this page open during the 
              entire payment process until I see the confirmation message.
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onProceed}
              disabled={!isChecked}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                isChecked
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
