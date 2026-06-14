import toast, { Toaster as HotToaster } from 'react-hot-toast'

function initToasts() {
  // Default options are applied per-toast call
}

const success = (message: string, options?: Parameters<typeof toast.success>[1]) => {
  return toast.success(message, {
    style: {
      borderRadius: '16px',
      padding: '12px 20px',
      fontSize: '14px',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
    },
    ...options,
  })
}

const error = (message: string, options?: Parameters<typeof toast.error>[1]) => {
  return toast.error(message, {
    style: {
      borderRadius: '16px',
      padding: '12px 20px',
      fontSize: '14px',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
    },
    ...options,
  })
}

const info = (message: string, options?: Parameters<typeof toast>[1]) => {
  return toast(message, {
    icon: (
      <svg className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
    style: {
      borderRadius: '16px',
      padding: '12px 20px',
      fontSize: '14px',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
    },
    ...options,
  })
}

const dismiss = (toastId?: string) => {
  toast.dismiss(toastId)
}

export { HotToaster as Toaster, initToasts, success, error, info, dismiss }
export default { success, error, info, dismiss, initToasts, Toaster: HotToaster }
