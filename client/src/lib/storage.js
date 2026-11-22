/** Safe localStorage helpers — all mood data stays on this device. */
const PREFIX = 'mindline:';

export function read(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function remove(key) {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* storage unavailable */
  }
}

// Mood entries -------------------------------------------------------------
export function getMoods() {
  const entries = read('moods', []);
  return Array.isArray(entries) ? entries : [];
}

export function addMood(entry) {
  const entries = getMoods();
  const next = [{ ...entry, id: entry.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }, ...entries];
  write('moods', next);
  return next;
}

export function deleteMood(id) {
  const next = getMoods().filter((entry) => entry.id !== id);
  write('moods', next);
  return next;
}

// Bookmarks ----------------------------------------------------------------
export function getBookmarks() {
  const entries = read('bookmarks', []);
  return Array.isArray(entries) ? entries : [];
}

export function toggleBookmark(id) {
  const entries = getBookmarks();
  const next = entries.includes(id) ? entries.filter((item) => item !== id) : [...entries, id];
  write('bookmarks', next);
  return next;
}
