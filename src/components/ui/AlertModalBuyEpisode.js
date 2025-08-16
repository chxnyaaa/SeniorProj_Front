"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, XCircle, Info, CreditCard } from "lucide-react"

export default function AlertModalBuyEpisode({
  show = false,
  type = "info", // "success", "error", "warning", "info"
  title = "Confirm Purchase",
  message = "You are about to spend coins to unlock this episode.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  oneButton = false,
  coinCost = 0,  // จำนวนเหรียญที่จะหัก
  userCoinBalance = 0, // เหรียญคงเหลือของผู้ใช้
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

  // ถ้าเหรียญไม่พอ ให้เปลี่ยนข้อความและ type
  const insufficientCoins = userCoinBalance < coinCost

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center"> */}
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[500px] text-center">
        <div className="flex flex-col items-center">
          {insufficientCoins ? (
            <>
              <XCircle className="text-red-500 w-20 h-20 mb-2" />
              <h2 className="text-2xl font-semibold mb-2 text-red-600">Insufficient Coins</h2>
              <p className="text-gray-700 mb-4">
                You need {coinCost} coins to unlock this episode, but you only have {userCoinBalance} coins.
              </p>
            </>
          ) : (
            <>
              {iconMap[type]}
              <h2 className={`text-2xl font-semibold mb-2 ${colorMap[type]}`}>{title}</h2>
              <p className="text-gray-700 mb-4">{message}</p>
            </>
          )}
        </div>

        <div className="flex justify-center space-x-4">
          {!oneButton && (
            <Button variant="outline" onClick={onCancel}>
              {cancelText}
            </Button>
          )}
          <Button
            onClick={onConfirm}
            disabled={insufficientCoins}
            className={insufficientCoins ? "opacity-50 cursor-not-allowed" : ""}
          >
            {insufficientCoins ? "Cannot Confirm" : confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
