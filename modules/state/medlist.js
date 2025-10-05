// modules/state/medlist.js
const KEY = "medList.v1";

/**
 * Entry shape persisted in localStorage:
 * { id: string, rxcui: string|null, name: string }
 * - id: rxcui if available, else "NAME:<UPPER_NAME>"
 * - name: UI display string
 */
export function loadMedList() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveMedList(entries) {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export function clearMedList() {
  localStorage.removeItem(KEY);
}

export function hasMedList() {
  return loadMedList().length > 0;
}

/**
 * From your normalized array -> a unique list for storage.
 * Prefers RXCUI; falls back to display/query.
 */
export function entriesFromNormalized(normalized) {
  const byId = new Map();
  for (const n of normalized) {
    // skip totally missing results if you want
    const name = n.display || n.query;
    if (!name) continue;

    const id = n.rxcui ? String(n.rxcui) : `NAME:${name.toUpperCase()}`;
    if (!byId.has(id)) byId.set(id, { id, rxcui: n.rxcui || null, name });
  }
  return [...byId.values()];
}
