import * as React from "react"
const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 10000
type ToasterToast = { id: string; title?: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode; open?: boolean }
let count = 0
function genId() { return (count = (count + 1) % Number.MAX_SAFE_INTEGER).toString() }
const listeners: Array<(toasts: ToasterToast[]) => void> = []
let memoryToasts: ToasterToast[] = []
function dispatch(toast: ToasterToast) {
  memoryToasts = [toast, ...memoryToasts].slice(0, TOAST_LIMIT)
  listeners.forEach((listener) => listener(memoryToasts))
}
export function useToast() {
  const [toasts, setToasts] = React.useState<ToasterToast[]>(memoryToasts)
  React.useEffect(() => {
    listeners.push(setToasts)
    return () => { const index = listeners.indexOf(setToasts); if (index > -1) listeners.splice(index, 1) }
  }, [])
  return {
    toasts,
    toast: (props: Omit<ToasterToast, "id">) => {
      const id = genId()
      dispatch({ ...props, id, open: true })
    }
  }
}
