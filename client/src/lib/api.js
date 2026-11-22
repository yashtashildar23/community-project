const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Optional remote refresh. The app is fully functional with bundled data;
 * this only keeps the directory current when the API happens to be online.
 */
export async function fetchHelplines() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch(`${API_BASE}/api/helplines`, { signal: controller.signal });
    if (!response.ok) return null;
    const payload = await response.json();
    return Array.isArray(payload.data) ? payload.data : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchArticles() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch(`${API_BASE}/api/articles`, { signal: controller.signal });
    if (!response.ok) return null;
    const payload = await response.json();
    return Array.isArray(payload.data) ? payload.data : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
