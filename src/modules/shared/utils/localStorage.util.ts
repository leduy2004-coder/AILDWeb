export function getLocalStorageItem<T>(item: string): T {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(item) as T;
  }
  return null as unknown as T;
}

export function setLocalStorageItems(items: Record<string, string>) {
  if (typeof items !== 'object' || Array.isArray(items)) {
    throw new Error('Items must be an object');
  }

  Object.entries(items).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
}

export function removeLocalStorageItems(items: Array<string>) {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array string');
  }

  Object.entries(items).forEach(([key]) => {
    localStorage.removeItem(key);
  });
}

export function clearLocalStorageItems(items: Array<string>) {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array of strings');
  }

  items.forEach((key) => {
    localStorage.removeItem(key);
  });
}
