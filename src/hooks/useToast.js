import { useState, useCallback } from 'react'

export const useToast = () => {
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'info' // 'info', 'success', 'error'
  })

  const showToast = useCallback((message, type = 'info') => {
    setToast({
      visible: true,
      message,
      type
    })

    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }))
    }, 3000)
  }, [])

  return { toast, showToast }
}