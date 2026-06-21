import type { Bean } from "../types/bean";

const STORAGE_KEY = "snoopboopsnoop-coffee-local-beans";

export function loadLocalBeans(): Bean[] {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalBeans(beans: Bean[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(beans));
}

export function addLocalBean(bean: Bean) {
  const existingBeans = loadLocalBeans();
  saveLocalBeans([bean, ...existingBeans]);
}

export function clearLocalBeans() {
  window.localStorage.removeItem(STORAGE_KEY);
}