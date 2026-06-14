interface StorageItem<T> {
  value: T
  expiry?: number
}

export function getStorageItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key)
    if (!item) return null

    const parsed: StorageItem<T> = JSON.parse(item)

    if (parsed.expiry && Date.now() > parsed.expiry) {
      localStorage.removeItem(key)
      return null
    }

    return parsed.value
  } catch {
    return null
  }
}

export function setStorageItem<T>(
  key: string,
  value: T,
  expiryHours?: number
): void {
  try {
    const item: StorageItem<T> = { value }

    if (expiryHours) {
      item.expiry = Date.now() + expiryHours * 60 * 60 * 1000
    }

    localStorage.setItem(key, JSON.stringify(item))
  } catch {
    // Storage full or unavailable
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // Ignore errors
  }
}
