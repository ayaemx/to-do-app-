"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNotification } from "@/contexts/notification-context"

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const toastColors = {
  success: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20",
  error: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20",
  warning: "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20",
  info: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20",
}

const iconColors = {
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600 dark:text-red-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  info: "text-blue-600 dark:text-blue-400",
}

export function ToastContainer() {
  const { toasts, dismissToast } = useNotification()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = toastIcons[toast.type]

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.3 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <Card className={`${toastColors[toast.type]} border shadow-lg`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${iconColors[toast.type]}`} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{toast.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{toast.message}</p>
                      {toast.action && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toast.action.onClick}
                          className="mt-2 h-7 text-xs bg-transparent"
                        >
                          {toast.action.label}
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissToast(toast.id)}
                      className="h-6 w-6 p-0 hover:bg-transparent"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
