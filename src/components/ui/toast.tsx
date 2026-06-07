import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: "default" | "success" | "error" | "warning"
  duration?: number
  onClose?: () => void
  showOverlay?: boolean
}

function Toast({ title, description, variant = "default", onClose, showOverlay = false }: ToastProps) {
  if (showOverlay && variant === "success") {
    return (
      <>
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/50 z-[99]"
          onClick={onClose}
        />
        {/* Toast Modal */}
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center text-center">
              {/* Icon tròn teal với checkmark */}
              <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mb-4">
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </div>
              {/* Text */}
              {title && (
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {title}
                </p>
              )}
              {description && (
                <p className="text-sm text-gray-600">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }

  // Default toast style (cho các variant khác)
  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        variant === "default" && "border bg-background text-foreground",
        variant === "success" && "border-green-500 bg-green-50 text-green-900",
        variant === "error" && "border-red-500 bg-red-50 text-red-900",
        variant === "warning" && "border-yellow-500 bg-yellow-50 text-yellow-900"
      )}
    >
      <div className="grid gap-1">
        {title && (
          <div className={cn(
            "text-sm font-semibold",
            variant === "success" && "text-green-900",
            variant === "error" && "text-red-900",
            variant === "warning" && "text-yellow-900"
          )}>
            {title}
          </div>
        )}
        {description && (
          <div className={cn(
            "text-sm opacity-90",
            variant === "success" && "text-green-800",
            variant === "error" && "text-red-800",
            variant === "warning" && "text-yellow-800"
          )}>
            {description}
          </div>
        )}
      </div>
    </div>
  )
}

export { Toast }

