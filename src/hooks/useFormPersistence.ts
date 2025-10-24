import { useState, useEffect } from 'react';

/**
 * Custom hook to persist form data in localStorage
 * @param key - The key to use for localStorage
 * @param initialValue - The initial value of the form data
 * @returns [formData, setFormData, clearFormData]
 */
export function useFormPersistence<T>(key: string, initialValue: T) {
  const [formData, setFormDataState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setFormData = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(formData) : value;
      setFormDataState(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  const clearFormData = () => {
    try {
      window.localStorage.removeItem(key);
      setFormDataState(initialValue);
    } catch (error) {
      console.error(`Error clearing ${key} from localStorage:`, error);
    }
  };

  return [formData, setFormData, clearFormData] as const;
}
