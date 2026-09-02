export function clearSessionStorage() {
  if (typeof window !== 'undefined') {
    sessionStorage.clear();
  }
}

export function getSessionStorageItem<T>(item: string): T {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(item) as T;
  }
  return null as unknown as T;
}

export function setSessionStorageItems(items: Record<string, string>) {
  if (typeof items !== 'object' || Array.isArray(items)) {
    throw new Error('Items must be an object');
  }

  if (typeof window !== 'undefined') {
    Object.entries(items).forEach(([key, value]) => {
      sessionStorage.setItem(key, value);
    });
  }
}

export function removeSessionStorageItems(items: Array<string>) {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array string');
  }

  if (typeof window !== 'undefined') {
    items.forEach((key) => {
      sessionStorage.removeItem(key);
    });
  }
}
