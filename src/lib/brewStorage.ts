import type { Brew } from "../types/brew";

const STORAGE_KEY = "snoopboopsnoop-coffee-local-brews";

export function loadLocalBrews(): Brew[] {
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

export function saveLocalBrews(brews: Brew[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(brews));
}

export function addLocalBrew(brew: Brew) {
  const existingBrews = loadLocalBrews();
  saveLocalBrews([brew, ...existingBrews]);
}

export function clearLocalBrews() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function deleteLocalBrew(id: string) {
  const updatedBrews = loadLocalBrews().filter((brew) => brew.id !== id);

  saveLocalBrews(updatedBrews);
}