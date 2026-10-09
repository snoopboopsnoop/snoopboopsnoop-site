import type { Concentrate } from "../types/water";
import { isConcentrate } from "./water.ts";

const STORAGE_KEY = "snoopboopsnoop-coffee-concentrates";

export function loadConcentrates(): Concentrate[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isConcentrate) : [];
  } catch {
    return [];
  }
}

export function saveConcentrates(concentrates: Concentrate[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(concentrates));
}
