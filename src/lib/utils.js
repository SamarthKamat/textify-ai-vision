export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const validateImageType = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  return validTypes.includes(file.type)
}