import { useState, useEffect } from 'react';

/**
 * useLocalStorage — persists state to localStorage
 * @param {string} key - localStorage key
 * @param {*} initialValue - default value if nothing in storage
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.warn(`useLocalStorage: error reading key "${key}"`, err);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      // Allow value to be a function (like useState setter)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.warn(`useLocalStorage: error setting key "${key}"`, err);
    }
  };

  return [storedValue, setValue];
}
