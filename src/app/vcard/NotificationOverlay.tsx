/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner"
import { CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function showSuccess(message: string) {
  toast.custom((t: any) => (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-green-300 bg-green-50 p-4 shadow-md transition-all",
        t.visible ? "animate-in slide-in-from-top fade-in" : "animate-out slide-out-to-top fade-out"
      )}
    >
      <CheckCircle className="h-6 w-6 text-green-600" />
      <div className="flex flex-col">
        <span className="text-green-800 font-semibold">{message}</span>
        <span className="text-green-700 text-sm">Tác vụ đã hoàn tất thành công 🎉</span>
      </div>
    </div>
  ))
}

export function showError(message: string) {
  toast.custom((t: any) => (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-red-300 bg-red-50 p-4 shadow-md transition-all",
        t.visible ? "animate-in slide-in-from-top fade-in" : "animate-out slide-out-to-top fade-out"
      )}
    >
      <XCircle className="h-6 w-6 text-red-600" />
      <div className="flex flex-col">
        <span className="text-red-800 font-semibold">{message}</span>
        <span className="text-red-700 text-sm">Đã có lỗi xảy ra 😓</span>
      </div>
    </div>
  ))
}
