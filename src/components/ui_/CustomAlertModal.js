"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react"

export default function CustomAlertModal({
  show = false,
  type = "info", // "success", "error", "warning", "info"
  title = "Alert",
  message = "",
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  oneButton = false,
}) {
  if (!show) return null

  const iconMap = {
    success: <CheckCircle className="text-green-500 w-20 h-20 mb-2" />,
    error: <XCircle className="text-red-500 w-20 h-20 mb-2" />,
    warning: <AlertTriangle className="text-yellow-500 w-20 h-20 mb-2" />,
    info: <Info className="text-blue-500 w-20 h-20 mb-2" />,
  }

  const colorMap = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center">
        <div className="flex flex-col items-center">
          {iconMap[type]}
          <h2 className={`text-2xl font-semibold mb-2 ${colorMap[type]}`}>{title}</h2>
          <p className="text-gray-700 mb-6">{message}</p>
        </div>
        <div className="flex justify-center space-x-4">
          {!oneButton && (
            <Button variant="outline" onClick={onCancel}>
              {cancelText}
            </Button>
          )}
          <Button onClick={onConfirm}>{confirmText}</Button>
        </div>
      </div>
    </div>
  )
}
