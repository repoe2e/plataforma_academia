const PREFIX = 'fitflow_'

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function save<T>(key: string, data: T): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(data))
}

export function remove(key: string): void {
  localStorage.removeItem(PREFIX + key)
}
