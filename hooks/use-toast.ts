import toast from "react-hot-toast"

export function useToast() {
  return {
    toast: (options: {
      title?: string
      description?: string
      variant?: "default" | "destructive"
      duration?: number
    }) => {
      const message = options.title || options.description || ""
      
      if (options.variant === "destructive") {
        toast.error(message, {
          duration: options.duration || 4000,
        })
      } else {
        toast.success(message, {
          duration: options.duration || 4000,
        })
      }
    },
  }
}

// Export toast function directly for compatibility
export { toast }
