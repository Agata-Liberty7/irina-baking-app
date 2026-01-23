import type { Profile } from "./profileLoader";

const STORAGE_KEY = "customProfiles";

export function loadCustomProfiles(): Profile[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCustomProfile(profile: Profile) {
  const all = loadCustomProfiles();
  all.push(profile);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
