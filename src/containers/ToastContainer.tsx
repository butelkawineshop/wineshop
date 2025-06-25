import { ToastContainer as ReactToastifyContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import React from 'react'
import { UI_CONSTANTS } from '@/constants/ui'

/**
 * ToastContainer component for displaying toast notifications
 *
 * This component provides a centralized toast notification system using react-toastify.
 * It configures the toast container with consistent settings for the entire application.
 *
 * @returns React toast container component
 *
 * @example
 * ```tsx
 * // In your app layout
 * <div>
 *   <YourAppContent />
 *   <ToastContainer />
 * </div>
 *
 * // Usage in components
 * import { toast } from 'react-toastify'
 *
 * toast.success('Operation completed successfully')
 * toast.error('Something went wrong')
 * toast.info('Here is some information')
 * ```
 */
export const ToastContainer = (): React.JSX.Element => {
  return (
    <ReactToastifyContainer
      position={UI_CONSTANTS.TOAST.POSITION}
      autoClose={UI_CONSTANTS.TOAST.AUTO_CLOSE_MS}
      hideProgressBar={UI_CONSTANTS.TOAST.HIDE_PROGRESS_BAR}
      newestOnTop={UI_CONSTANTS.TOAST.NEWEST_ON_TOP}
      closeOnClick={UI_CONSTANTS.TOAST.CLOSE_ON_CLICK}
      rtl={UI_CONSTANTS.TOAST.RTL}
      pauseOnFocusLoss={UI_CONSTANTS.TOAST.PAUSE_ON_FOCUS_LOSS}
      draggable={UI_CONSTANTS.TOAST.DRAGGABLE}
      pauseOnHover={UI_CONSTANTS.TOAST.PAUSE_ON_HOVER}
      theme={UI_CONSTANTS.TOAST.THEME}
      role="alert"
      aria-live="polite"
    />
  )
}
